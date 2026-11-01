const express = require('express');
const { body, validationResult } = require('express-validator');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/parents/children
// @desc    Get parent's children
// @access  Private/Parent
router.get('/children', protect, async (req, res) => {
    try {
        const parent = await Parent.findOne({ userId: req.user._id });
        
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: 'Parent profile not found'
            });
        }

        const children = await Student.find({ _id: { $in: parent.children } });

        res.json({
            success: true,
            data: children
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/parents/child/:admissionNumber
// @desc    Get child by admission number
// @access  Private/Parent
router.get('/child/:admissionNumber', protect, async (req, res) => {
    try {
        const parent = await Parent.findOne({ userId: req.user._id });
        
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: 'Parent profile not found'
            });
        }

        const student = await Student.findOne({
            admissionNumber: req.params.admissionNumber.toUpperCase(),
            parentId: parent._id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Child not found or not associated with this parent'
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

module.exports = router;

