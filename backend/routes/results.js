const express = require('express');
const { body, validationResult } = require('express-validator');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/results/student/:admissionNumber
// @desc    Get student results
// @access  Private
router.get('/student/:admissionNumber', protect, async (req, res) => {
    try {
        const { term, year } = req.query;
        const query = { admissionNumber: req.params.admissionNumber.toUpperCase() };
        
        if (term) query.term = term;
        if (year) query.year = parseInt(year);

        const results = await Result.find(query).sort({ year: -1, term: 1 });

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/results
// @desc    Add/update results (teacher/admin only)
// @access  Private/Teacher/Admin
router.post('/', protect, authorize('teacher', 'admin'), [
    body('admissionNumber').trim().notEmpty(),
    body('term').isIn(['Term 1', 'Term 2', 'Term 3']),
    body('year').isInt(),
    body('subjects').isArray().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const result = await Result.create({
            ...req.body,
            admissionNumber: req.body.admissionNumber.toUpperCase(),
            enteredBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Results added successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

