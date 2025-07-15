const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const { ROLES, PERMISSIONS } = require('../config/roles')
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.usrId).select('-password');

        if(!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).json({
            success: 'false',
            message: 'Not authorized to access this resource.'
        })
    }
};


// Role-based middleware
const requireRole = (...roles) => {
    return (req,res,next) => {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    }
};


// Permission-based middleware
const requirePermission = (permission) => {
    return(req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        if(!req.user.hasPermission(permission)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required permission: ${permission}.`
            });
        }
        next();
    }
};


// Multiple permissions middleware
const requireAnyPermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const hasAnyPermission = permissions.some(permission => 
            req.user.hasPermission(permission)
        );

        if (!hasAnyPermission) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required one of: ${permissions.join(', ')}`
            });
        }

        next();
    };
};


module.exports = {
    protect,
    requireRole,
    requirePermission,
    requireAnyPermission
}