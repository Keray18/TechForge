const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');
const { ROLE_PERMISSIONS } = require('../config/roles');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const URL = process.env.NODE_ENV === 'production' ? 'https://tech-forge-seven.vercel.app' : 'http://localhost:3000';

// Register Client
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, company } = req.body;
        
        // Validate required fields (company is optional)
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists" 
            });
        }

        // Generate password
        const password = crypto.randomBytes(8).toString('hex');
        
        // Send Email to the client
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your account has been created Successfully!",
            html: `
                <h1>Welcome to The Code End ${firstName}</h1>
                <p>Your emailID is: ${email}</p>
                <p>Your password is: ${password}</p>
                <p>Please follow the link to login to your account to continue.</p>
                <a href="${URL}/login">Login</a>
            `
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        // If company is empty or missing, set to 'individual'
        const companyValue = company && company.trim() !== '' ? company : 'individual';

        // Create user with default role and permissions
        const user = await User.create({
            firstName,
            lastName,
            company: companyValue,
            email,
            password: hashedPassword,
            role: 'client',
            permissions: ROLE_PERMISSIONS.client
        });

        const token = jwt.sign({ usrId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Error creating user",
            error: error.message 
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "User does not exist" 
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ usrId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Error logging in",
            error: error.message 
        });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Check if user has admin role or view_all_users permission
        if (req.user.role !== 'admin' && !req.user.permissions.includes('view_all_users')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Get all users excluding password field
        const users = await User.find({}).select('-password');
        
        res.status(200).json({
            success: true,
            count: users.length,
            users: users.map(user => ({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                role: user.role,
                isActive: user.isActive,
                verified: user.verified,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }))
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};


// Delete Project


// verify User
// const verifyUser = async (req, res) => {
//     const { token } = req.query;
//     const user = await User.findOne({verificationToken: token});
//     if (!user) return res.status(400).send('Invalid or expired token');
//     user.verified = true;
//     user.verificationToken = undefined;
//     await user.save();
//     res.send('Email verified successfully');
// }

module.exports = { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    getAllUsers,
    // verifyUser 
};
