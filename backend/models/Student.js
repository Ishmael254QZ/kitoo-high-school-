const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    class: {
        type: String,
        required: true,
        trim: true
    },
    form: {
        type: String,
        enum: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
        required: true
    },
    stream: {
        type: String,
        enum: ['North', 'South', 'East', 'West'],
        required: true
    },
    kcpeIndex: {
        type: String,
        trim: true
    },
    kcpeMarks: {
        type: Number,
        min: 0,
        max: 500
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    },
    documents: {
        birthCertificate: String,
        kcpeResults: String,
        passportPhoto: String
    },
    balance: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ userId: 1 });
studentSchema.index({ parentId: 1 });
studentSchema.index({ class: 1 });

module.exports = mongoose.model('Student', studentSchema);

