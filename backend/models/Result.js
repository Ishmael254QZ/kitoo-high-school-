const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    admissionNumber: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true,
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    year: {
        type: Number,
        required: true
    },
    subjects: [{
        subject: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        grade: {
            type: String,
            enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E']
        },
        points: {
            type: Number,
            min: 0,
            max: 12
        }
    }],
    totalMarks: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    },
    meanGrade: {
        type: String
    },
    position: {
        type: Number
    },
    totalStudents: {
        type: Number
    },
    enteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Calculate totals before saving
resultSchema.pre('save', function(next) {
    if (this.subjects && this.subjects.length > 0) {
        this.totalMarks = this.subjects.reduce((sum, sub) => sum + sub.marks, 0);
        this.average = this.totalMarks / this.subjects.length;
    }
    next();
});

// Index
resultSchema.index({ studentId: 1 });
resultSchema.index({ admissionNumber: 1 });
resultSchema.index({ class: 1 });
resultSchema.index({ year: 1, term: 1 });

module.exports = mongoose.model('Result', resultSchema);

