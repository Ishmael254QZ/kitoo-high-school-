const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/admin/staff
// @desc    Add new staff member (admin only)
// @access  Private/Admin
router.post('/staff', protect, authorize('admin'), [
    body('fullName').trim().notEmpty(),
    body('staffId').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().notEmpty(),
    body('role').isIn(['Teacher', 'Administrator', 'Support Staff', 'Librarian', 'Accountant']),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { fullName, staffId, email, phone, role, department, password } = req.body;

        // Check if email or staffId already exists
        const existingUser = await User.findOne({ email });
        const existingTeacher = await Teacher.findOne({ 
            $or: [{ staffId: staffId.toUpperCase() }, { email }] 
        });

        if (existingUser || existingTeacher) {
            return res.status(400).json({
                success: false,
                message: 'Staff member with this email or staff ID already exists'
            });
        }

        // Create user account
        const userRoles = {
            Teacher: 'teacher',
            Administrator: 'admin',
            'Support Staff': 'staff',
            Librarian: 'librarian',
            Accountant: 'accountant'
        };

        const user = await User.create({
            email,
            password,
            role: userRoles[role],
            username: email.split('@')[0]
        });

        // Create teacher/staff record
        const teacher = await Teacher.create({
            userId: user._id,
            staffId: staffId.toUpperCase(),
            fullName,
            email,
            phone,
            role,
            department: department || ''
        });

        res.status(201).json({
            success: true,
            message: 'Staff member added successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                teacher
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/admin/staff
// @desc    Get all staff members
// @access  Private/Admin
router.get('/staff', protect, authorize('admin'), async (req, res) => {
    try {
        const staff = await Teacher.find()
            .populate('userId', 'email username isActive lastLogin')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    try {
        const Student = require('../models/Student');
        const Admission = require('../models/Admission');
        const Fee = require('../models/Fee');
        const { LibraryBook, BookIssue } = require('../models/Library');

        const [
            totalStudents,
            totalStaff,
            pendingAdmissions,
            totalFees,
            collectedFees,
            overdueBooks
        ] = await Promise.all([
            Student.countDocuments({ isActive: true }),
            Teacher.countDocuments({ isActive: true }),
            Admission.countDocuments({ status: 'pending' }),
            Fee.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
            Fee.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
            BookIssue.countDocuments({ status: 'overdue' })
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                totalStaff,
                pendingAdmissions,
                totalFees: totalFees[0]?.total || 0,
                collectedFees: collectedFees[0]?.total || 0,
                overdueBooks
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
