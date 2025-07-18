const Project = require("../models/projectModel");
const User = require("../models/usersModel");
const Notification = require("../models/notificationModel");
const multer = require('multer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });


// Submit new project
const submitProject = async (req, res) => {
    try {
        const { title, category, description, budget, timeline, priority } = req.body;
        const clientId = req.user.id;

        // Validate required fields
        if (!title || !category || !description || !budget || !timeline || !priority || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const project = await Project.create({
            title,
            category,
            description,
            budget,
            timeline,
            priority,
            client: clientId
        });

        const client = await User.findById(clientId);
        const adminUsers = await User.find({ role: 'admin' });
        const clientMail = client.email;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `${title} project - ${client.lastName}`,
            text: `
            A new project has been submitted by ${client.firstName} ${client.lastName}.
            Project Title: ${title}
            Project Category: ${category}
            Project Description: ${description}
            Project Budget: ${budget}
            Project Timeline: ${timeline}
            Project Priority: ${priority}
            For Contact: ${client.phone}

            Please review the project and take appropriate action.`,
            attachments: req.file ? [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer,
                },
            ] : [],
        }
        await transporter.sendMail(mailOptions);

        console.log(`Found ${adminUsers.length} admin users for notifications`);
        console.log('Admin users:', adminUsers.map(admin => ({ id: admin._id, email: admin.email, role: admin.role })));

        // Create notifications for all admins
        const notifications = adminUsers.map(admin => ({
            recipient: admin._id,
            sender: clientId,
            type: 'project_submitted',
            title: 'New Project Submission',
            message: `${client.firstName} ${client.lastName} has submitted a new project: ${title}`,
            project: project._id,
            actionRequired: true
        }));

        console.log('Creating notifications:', notifications);

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`Successfully created ${notifications.length} notifications`);
        } else {
            console.log('No notifications created - no admin users found');
        }

        await project.populate('client', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Project submitted successfully',
            project
        });

    } catch (error) {
        console.error('Error submitting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit project',
            error: error.message
        });
    }
};

// Get all projects (for admin/employee)
const getAllProjects = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const projects = await Project.find(query)
            .populate('client', 'firstName lastName email company')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Project.countDocuments(query);

        res.status(200).json({
            success: true,
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

// Get client's own projects
const getClientProjects = async (req, res) => {
    try {
        const clientId = req.user.id;

        const projects = await Project.find({ client: clientId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        console.error('Error fetching client projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your projects',
            error: error.message
        });
    }
};

// Accept project
const acceptProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const adminId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (project.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Project is not in pending status'
            });
        }

        project.status = 'accepted';
        project.acceptedAt = new Date();
        await project.save();

        await Notification.create({
            recipient: project.client,
            sender: adminId,
            type: 'project_accepted',
            title: 'Project Accepted',
            message: `Your project "${project.title}" has been accepted!`,
            project: project._id
        });

        await project.populate('client', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Project accepted successfully',
            project
        });

    } catch (error) {
        console.error('Error accepting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept project',
            error: error.message
        });
    }
};

// Reject project
const rejectProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (project.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Project is not in pending status'
            });
        }

        project.status = 'rejected';
        project.rejectedAt = new Date();
        project.rejectionReason = rejectionReason;
        await project.save();

        await Notification.create({
            recipient: project.client,
            sender: adminId,
            type: 'project_rejected',
            title: 'Project Rejected',
            message: `Your project "${project.title}" has been rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
            project: project._id
        });

        await project.populate('client', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Project rejected successfully',
            project
        });

    } catch (error) {
        console.error('Error rejecting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject project',
            error: error.message
        });
    }
};

// Complete project
const completeProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const adminId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (project.status !== 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Project must be accepted first'
            });
        }

        project.status = 'completed';
        project.completedAt = new Date();
        await project.save();

        await Notification.create({
            recipient: project.client,
            sender: adminId,
            type: 'project_completed',
            title: 'Project Completed',
            message: `Your project "${project.title}" has been completed!`,
            project: project._id
        });

        await project.populate('client', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Project completed successfully',
            project
        });

    } catch (error) {
        console.error('Error completing project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete project',
            error: error.message
        });
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId)
            .populate('client', 'firstName lastName email company');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting project',
            error: error.message
        });
    }
};

// Filter Projects
const filterProjects = async (req, res) => {
    try {
        const { search, status, sortBy='createdAt', order='desc', page=1, limit=10 } = req.query;
        const ALLOWED_SORT_FIELDS = ['createdAt', 'title', 'status', 'budget'];
        

        if (!ALLOWED_SORT_FIELDS.includes(sortBy)) sortBy = 'createdAt';
        if (!['asc', 'desc'].includes(order)) order = 'desc';
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, Math.min(100, parseInt(limit)));

        let query = {};
        if(search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } },
            ]
        };

        if(status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const projects = await Project.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Project.countDocuments(query);

        res.status(200).json({
            success: true,
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error filtering projects',
            error: error.message
        });
    }
}

module.exports = {
    submitProject,
    getAllProjects,
    getClientProjects,
    acceptProject,
    rejectProject,
    completeProject,
    getProjectById,
    filterProjects
};




