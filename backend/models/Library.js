const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    totalCopies: {
        type: Number,
        required: true,
        min: 1
    },
    availableCopies: {
        type: Number,
        default: function() {
            return this.totalCopies;
        }
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
}, {
    timestamps: true
});

const bookIssueSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LibraryBook',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    admissionNumber: {
        type: String,
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedDate: Date,
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    },
    fine: {
        type: Number,
        default: 0
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index
bookIssueSchema.index({ studentId: 1 });
bookIssueSchema.index({ bookId: 1 });
bookIssueSchema.index({ status: 1 });
bookIssueSchema.index({ dueDate: 1 });

const LibraryBook = mongoose.model('LibraryBook', libraryBookSchema);
const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

module.exports = { LibraryBook, BookIssue };

