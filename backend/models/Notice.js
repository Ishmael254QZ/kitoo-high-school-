const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['General', 'Academic', 'Fees', 'Events', 'Discipline'],
        default: 'General'
    },
    targetAudience: {
        type: [String],
        enum: ['Students', 'Parents', 'Teachers', 'All'],
        default: ['All']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [{
        filename: String,
        path: String,
        mimetype: String,
        size: Number
    }]
}, {
    timestamps: true
});

// Index
noticeSchema.index({ status: 1 });
noticeSchema.index({ publishedAt: -1 });
noticeSchema.index({ category: 1 });

module.exports = mongoose.model('Notice', noticeSchema);

