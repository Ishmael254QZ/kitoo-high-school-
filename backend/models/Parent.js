const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    relationship: {
        type: String,
        enum: ['Father', 'Mother', 'Guardian'],
        default: 'Guardian'
    }
}, {
    timestamps: true
});

// Index
parentSchema.index({ userId: 1 });
parentSchema.index({ email: 1 });

module.exports = mongoose.model('Parent', parentSchema);

