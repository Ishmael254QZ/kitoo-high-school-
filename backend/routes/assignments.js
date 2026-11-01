const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/assignments
// @desc    Get assignments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { class: className, status } = req.query;
        const query = {};
        
        if (className) query.class = className;
        if (status) query.status = status;

        const assignments = await Assignment.find(query)
            .populate('teacherId', 'fullName')
            .sort({ dueDate: 1 });

        res.json({
            success: true,
            data: assignments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/assignments
// @desc    Create assignment (teacher only)
// @access  Private/Teacher
router.post('/', protect, authorize('teacher'), [
    body('title').trim().notEmpty(),
    body('subject').trim().notEmpty(),
    body('class').trim().notEmpty(),
    body('dueDate').isISO8601()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const assignment = await Assignment.create({
            ...req.body,
            teacherId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

