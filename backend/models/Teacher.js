const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staffId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
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
    role: {
        type: String,
        enum: ['Teacher', 'Administrator', 'Support Staff', 'Librarian', 'Accountant'],
        required: true
    },
    department: {
        type: String,
        trim: true
    },
    subjects: [{
        type: String,
        trim: true
    }],
    classes: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index
teacherSchema.index({ userId: 1 });
teacherSchema.index({ staffId: 1 });
teacherSchema.index({ email: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);

