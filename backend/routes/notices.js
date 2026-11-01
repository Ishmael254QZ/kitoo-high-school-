const express = require('express');
const { body, validationResult } = require('express-validator');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notices
// @desc    Get active notices
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notices = await Notice.find({ status: 'active' })
            .populate('createdBy', 'username email')
            .sort({ publishedAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: notices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/notices
// @desc    Create notice (admin/teacher)
// @access  Private/Admin/Teacher
router.post('/', protect, authorize('admin', 'teacher'), [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const notice = await Notice.create({
            ...req.body,
            createdBy: req.user._id,
            publishedAt: req.body.status === 'active' ? new Date() : null
        });

        res.status(201).json({
            success: true,
            message: 'Notice created successfully',
            data: notice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

