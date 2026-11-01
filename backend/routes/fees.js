const express = require('express');
const { body, validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/fees/student/:admissionNumber
// @desc    Get fees for a student
// @access  Private
router.get('/student/:admissionNumber', protect, async (req, res) => {
    try {
        const fees = await Fee.find({ 
            admissionNumber: req.params.admissionNumber.toUpperCase() 
        }).sort({ createdAt: -1 });

        // Calculate total balance
        const totalBalance = fees.reduce((sum, fee) => sum + fee.balance, 0);

        res.json({
            success: true,
            data: fees,
            totalBalance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/fees/payment
// @desc    Record payment
// @access  Private
router.post('/payment', protect, [
    body('admissionNumber').trim().notEmpty(),
    body('amount').isFloat({ min: 0 }),
    body('paymentMethod').isIn(['M-Pesa', 'KCB Bank', 'Cash', 'Cheque']),
    body('transactionId').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { admissionNumber, amount, paymentMethod, transactionId, feeId } = req.body;

        // Find fee record
        let fee;
        if (feeId) {
            fee = await Fee.findById(feeId);
        } else {
            // Find active fee for student
            fee = await Fee.findOne({
                admissionNumber: admissionNumber.toUpperCase(),
                status: { $in: ['pending', 'partial'] }
            }).sort({ createdAt: -1 });
        }

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee record not found'
            });
        }

        // Add payment
        fee.payments.push({
            amount: parseFloat(amount),
            paymentMethod,
            transactionId,
            verified: paymentMethod === 'Cash' // Auto-verify cash payments
        });

        // Update paid amount
        fee.paidAmount = fee.payments
            .filter(p => p.verified)
            .reduce((sum, p) => sum + p.amount, 0);

        await fee.save();

        res.json({
            success: true,
            message: 'Payment recorded successfully',
            data: fee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/fees
// @desc    Create fee record (admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
    body('admissionNumber').trim().notEmpty(),
    body('term').isIn(['Term 1', 'Term 2', 'Term 3']),
    body('year').isInt(),
    body('totalAmount').isFloat({ min: 0 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const student = await Student.findOne({ 
            admissionNumber: req.body.admissionNumber.toUpperCase() 
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const fee = await Fee.create({
            ...req.body,
            studentId: student._id,
            admissionNumber: req.body.admissionNumber.toUpperCase()
        });

        // Update student balance
        student.balance = (student.balance || 0) + fee.totalAmount;
        await student.save();

        res.status(201).json({
            success: true,
            message: 'Fee record created successfully',
            data: fee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

