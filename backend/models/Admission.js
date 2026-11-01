const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    kcpeIndex: {
        type: String,
        required: true,
        trim: true
    },
    kcpeMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 500
    },
    parentName: {
        type: String,
        required: true,
        trim: true
    },
    parentEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    parentPhone: {
        type: String,
        required: true,
        trim: true
    },
    documents: {
        birthCertificate: {
            filename: String,
            path: String,
            mimetype: String,
            size: Number
        },
        kcpeResults: {
            filename: String,
            path: String,
            mimetype: String,
            size: Number
        },
        passportPhoto: {
            filename: String,
            path: String,
            mimetype: String,
            size: Number
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    admissionNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    remarks: String
}, {
    timestamps: true
});

// Index
admissionSchema.index({ status: 1 });
admissionSchema.index({ parentEmail: 1 });
admissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Admission', admissionSchema);

