const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    admissionNumber: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true,
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    year: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    payments: [{
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['M-Pesa', 'KCB Bank', 'Cash', 'Cheque'],
            required: true
        },
        transactionId: String,
        receiptNumber: String,
        paidAt: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'overdue'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Calculate balance before saving
feeSchema.pre('save', function(next) {
    this.balance = this.totalAmount - this.paidAmount;
    
    if (this.balance === 0) {
        this.status = 'paid';
    } else if (this.paidAmount > 0) {
        this.status = 'partial';
    } else {
        this.status = 'pending';
    }
    
    next();
});

// Index
feeSchema.index({ studentId: 1 });
feeSchema.index({ admissionNumber: 1 });
feeSchema.index({ status: 1 });

module.exports = mongoose.model('Fee', feeSchema);

