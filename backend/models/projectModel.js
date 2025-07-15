const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    category: {
        type: String,
        required: true,
        enum: ['web-development', 'mobile-app', 'desktop-app', 'api-development', 'database-design', 'ui-ux-design', 'other']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    budget: {
        type: String,
        required: true,
        enum: ['under-1k', '1k-5k', '5k-10k', '10k-25k', '25k-50k', 'over-50k']
    },
    timeline: {
        type: String,
        required: true,
        enum: ['asap', '1-week', '2-weeks', '1-month', '2-months', '3-months', 'flexible']
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    rejectedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null,
        maxlength: 500
    }
}, {
    timestamps: true
});

projectSchema.index({ client: 1, createdAt: -1 });
projectSchema.index({ status: 1, createdAt: -1 });


module.exports = mongoose.model('Project', projectSchema);