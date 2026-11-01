const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const { protect, generateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'parent'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password, role, username } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username: username || email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role,
            username: username || email.split('@')[0]
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        // Get additional user data based on role
        let additionalData = {};
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user._id });
            additionalData = { student };
        } else if (user.role === 'parent') {
            const parent = await Parent.findOne({ userId: user._id }).populate('children');
            additionalData = { parent };
        } else if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: user._id });
            additionalData = { teacher };
        }

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                username: user.username
            },
            ...additionalData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        let additionalData = {};

        if (req.user.role === 'student') {
            const student = await Student.findOne({ userId: req.user._id });
            additionalData = { student };
        } else if (req.user.role === 'parent') {
            const parent = await Parent.findOne({ userId: req.user._id }).populate('children');
            additionalData = { parent };
        } else if (req.user.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: req.user._id });
            additionalData = { teacher };
        }

        res.json({
            success: true,
            user: req.user,
            ...additionalData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = req.body.newPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP PIN for password recovery
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            return res.status(503).json({
                success: false,
                message: 'Password recovery is not configured. Please contact the school administrator.'
            });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                success: true,
                message: 'If an account exists for this email, a recovery PIN has been sent.'
            });
        }

        const pin = crypto.randomInt(100000, 1000000).toString();
        user.resetPasswordToken = crypto.createHash('sha256').update(pin).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || SMTP_USER,
                to: user.email,
                subject: 'Kitoo High School account recovery',
                text: `Your recovery PIN is ${pin}. It expires in 10 minutes.`
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            throw error;
        }

        res.json({
            success: true,
            message: 'If an account exists for this email, a recovery PIN has been sent.'
        });
    } catch (error) {
        console.error('Password recovery error:', error);
        res.status(500).json({ success: false, message: 'Unable to send recovery PIN. Please try again later.' });
    }
});

// @route   POST /api/auth/login-with-pin
// @desc    Login using OTP PIN
// @access  Public
router.post('/login-with-pin', [
    body('email').isEmail().normalizeEmail(),
    body('pin').isNumeric().isLength({ min: 6, max: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, pin } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: crypto.createHash('sha256').update(pin).digest('hex'),
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired PIN' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'User account is inactive' });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate Token
        const token = generateToken(user._id);

        // Get additional data (copied from login logic)
        let additionalData = {};
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user._id });
            additionalData = { student };
        } else if (user.role === 'parent') {
            const parent = await Parent.findOne({ userId: user._id }).populate('children');
            additionalData = { parent };
        } else if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: user._id });
            additionalData = { teacher };
        }

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                username: user.username
            },
            ...additionalData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
