const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/students/search/:admissionNumber
// @desc    Search student by admission number
// @access  Private
router.get('/search/:admissionNumber', protect, async (req, res) => {
    try {
        const student = await Student.findOne({
            admissionNumber: req.params.admissionNumber.toUpperCase()
        }).populate('parentId', 'fullName email phone');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/students
// @desc    Get all students (admin/teacher)
// @access  Private
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { class: className, page = 1, limit = 20 } = req.query;
        const query = className ? { class: className } : {};

        const students = await Student.find(query)
            .populate('parentId', 'fullName email phone')
            .sort({ admissionNumber: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Student.countDocuments(query);

        res.json({
            success: true,
            data: students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/students
// @desc    Create student (admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
    body('admissionNumber').trim().notEmpty(),
    body('fullName').trim().notEmpty(),
    body('class').trim().notEmpty(),
    body('form').isIn(['Form 1', 'Form 2', 'Form 3', 'Form 4']),
    body('stream').isIn(['North', 'South', 'East', 'West'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/students/:admissionNumber
// @desc    Delete student (admin only)
// @access  Private/Admin
router.delete('/:admissionNumber', protect, authorize('admin'), async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            admissionNumber: req.params.admissionNumber.toUpperCase()
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student removed successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

