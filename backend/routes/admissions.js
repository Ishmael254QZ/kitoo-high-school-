const express = require('express');
const { body, validationResult } = require('express-validator');
const Admission = require('../models/Admission');
const { protect, authorize } = require('../middleware/auth');
const { uploadAdmissionDocuments } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/admissions
// @desc    Submit admission application
// @access  Public
router.post('/', uploadAdmissionDocuments, [
    body('studentName').trim().notEmpty(),
    body('kcpeIndex').trim().notEmpty(),
    body('kcpeMarks').isInt({ min: 0, max: 500 }),
    body('parentName').trim().notEmpty(),
    body('parentEmail').isEmail().normalizeEmail(),
    body('parentPhone').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Check if all documents are uploaded
        if (!req.files || !req.files.birthCertificate || !req.files.kcpeResults || !req.files.passportPhoto) {
            return res.status(400).json({
                success: false,
                message: 'All three documents (Birth Certificate, KCPE Results, Passport Photo) are required'
            });
        }

        const documents = {
            birthCertificate: {
                filename: req.files.birthCertificate[0].filename,
                path: req.files.birthCertificate[0].path,
                mimetype: req.files.birthCertificate[0].mimetype,
                size: req.files.birthCertificate[0].size
            },
            kcpeResults: {
                filename: req.files.kcpeResults[0].filename,
                path: req.files.kcpeResults[0].path,
                mimetype: req.files.kcpeResults[0].mimetype,
                size: req.files.kcpeResults[0].size
            },
            passportPhoto: {
                filename: req.files.passportPhoto[0].filename,
                path: req.files.passportPhoto[0].path,
                mimetype: req.files.passportPhoto[0].mimetype,
                size: req.files.passportPhoto[0].size
            }
        };

        const admission = await Admission.create({
            ...req.body,
            documents
        });

        res.status(201).json({
            success: true,
            message: 'Admission application submitted successfully',
            data: admission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/admissions
// @desc    Get all admissions (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = status ? { status } : {};

        const admissions = await Admission.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('reviewedBy', 'username email');

        const total = await Admission.countDocuments(query);

        res.json({
            success: true,
            data: admissions,
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

// @route   PUT /api/admissions/:id/approve
// @desc    Approve admission (admin only)
// @access  Private/Admin
router.put('/:id/approve', protect, authorize('admin'), [
    body('admissionNumber').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const admission = await Admission.findById(req.params.id);
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        admission.status = 'approved';
        admission.admissionNumber = req.body.admissionNumber;
        admission.reviewedBy = req.user._id;
        admission.reviewedAt = new Date();
        admission.remarks = req.body.remarks || '';

        await admission.save();

        res.json({
            success: true,
            message: 'Admission approved successfully',
            data: admission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

