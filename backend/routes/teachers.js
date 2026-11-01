const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/teachers/student-info
// @desc    Add/update student information
// @access  Private/Teacher
router.post('/student-info', protect, authorize('teacher'), [
    body('admissionNumber').trim().notEmpty(),
    body('subject').trim().notEmpty(),
    body('grade').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { admissionNumber, subject, grade, remarks } = req.body;

        const student = await Student.findOne({
            admissionNumber: admissionNumber.toUpperCase()
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // In real app, this would update student records or create grade entries
        // For now, we'll just log it
        console.log('Student info added:', {
            admissionNumber,
            subject,
            grade,
            remarks,
            teacherId: req.user._id
        });

        res.json({
            success: true,
            message: 'Student information added successfully',
            data: {
                admissionNumber,
                subject,
                grade,
                remarks
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/teachers/classes
// @desc    Get teacher's classes
// @access  Private/Teacher
router.get('/classes', protect, authorize('teacher'), async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user._id });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher profile not found'
            });
        }

        res.json({
            success: true,
            data: {
                classes: teacher.classes,
                subjects: teacher.subjects
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

