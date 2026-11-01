const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    class: {
        type: String,
        required: true,
        trim: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    submittedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'draft'
    },
    submissions: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        file: String,
        grade: Number,
        remarks: String
    }]
}, {
    timestamps: true
});

// Index
assignmentSchema.index({ class: 1 });
assignmentSchema.index({ teacherId: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);

