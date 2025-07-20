const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    industry: {
        type: String,
        required: true,
        enum: ['IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Other']
    },
    company: {
        type: String,
        trim: true,
        maxlength: 100,
        default: 'Personal'
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['client','employee', 'admin'],
        default: 'client'
    },
    permissions: [{
        type: String,
        enum: [
            // Project permissions
            'create_project',
            'view_own_projects',
            'view_all_projects',
            'accept_project',
            'reject_project',
            'complete_project',
            'delete_project',
            
            // Notification permissions
            'view_notifications',
            'send_notifications',
            'delete_notifications'
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
}, {
    timestamps: true
});

// Methods for permission checking
userSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

userSchema.methods.hasRole = function(role) {
    return this.role === role;
};

userSchema.methods.isAdmin = function() {
    return ['admin', 'super_admin'].includes(this.role);
};

// indexes
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);