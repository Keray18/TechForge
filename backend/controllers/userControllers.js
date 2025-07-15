const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');
const { ROLE_PERMISSIONS } = require('../config/roles');
const dotenv = require('dotenv');
dotenv.config();

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, industry, company, email, phone, password, confirmPassword } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !industry || !company || !email || !phone || !password || !confirmPassword) {
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

        // Validate password
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Passwords do not match" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default role and permissions
        const user = await User.create({
            firstName,
            lastName,
            industry,
            company,
            email,
            phone,
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

module.exports = { 
    registerUser, 
    loginUser, 
    getCurrentUser 
};
