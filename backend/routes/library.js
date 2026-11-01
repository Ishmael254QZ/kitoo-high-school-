const express = require('express');
const { body, validationResult } = require('express-validator');
const { LibraryBook, BookIssue } = require('../models/Library');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/library/books
// @desc    Get all books
// @access  Private
router.get('/books', protect, async (req, res) => {
    try {
        const { search, category, subject } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (subject) query.subject = subject;

        const books = await LibraryBook.find(query).sort({ title: 1 });

        res.json({
            success: true,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/library/student/:admissionNumber
// @desc    Get student's borrowed books
// @access  Private
router.get('/student/:admissionNumber', protect, async (req, res) => {
    try {
        const issues = await BookIssue.find({
            admissionNumber: req.params.admissionNumber.toUpperCase(),
            status: { $in: ['active', 'overdue'] }
        }).populate('bookId', 'title author').sort({ dueDate: 1 });

        res.json({
            success: true,
            data: issues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/library/issue
// @desc    Issue book to student
// @access  Private/Librarian/Admin
router.post('/issue', protect, authorize('librarian', 'admin'), async (req, res) => {
    try {
        const { admissionNumber, bookId, dueDate } = req.body;

        const student = await require('../models/Student').findOne({
            admissionNumber: admissionNumber.toUpperCase()
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const book = await LibraryBook.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.availableCopies < 1) {
            return res.status(400).json({
                success: false,
                message: 'Book not available'
            });
        }

        // Create issue record
        await BookIssue.create({
            bookId,
            studentId: student._id,
            admissionNumber: student.admissionNumber,
            dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            status: 'active'
        });

        // Decrease available copies
        book.availableCopies -= 1;
        await book.save();

        res.status(201).json({
            success: true,
            message: 'Book issued successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/library/report
// @desc    Report library case to admin
// @access  Private/Librarian
router.post('/report', protect, authorize('librarian'), async (req, res) => {
    try {
        // In a real app, this might create a "Case" record or send an email
        // For now, we'll assume there's a SystemAlert or similar model, 
        // or just return success for the demo.

        // Example: Create a notice/alert for admin
        // await Alert.create({ ... })

        res.status(201).json({
            success: true,
            message: 'Case reported to admin successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

