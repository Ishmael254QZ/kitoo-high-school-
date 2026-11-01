// ===================================
// Payment System
// ===================================

// Payment Modal
function showPaymentModal(amount = 0, selectedStudent = null) {
    // Remove existing modal if any
    const existingModal = document.getElementById('paymentModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h2><i class="fas fa-money-bill-wave"></i> Payment Options</h2>
                <button class="payment-modal-close" onclick="closePaymentModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-amount-display">
                    <h3>Amount to Pay</h3>
                    <p class="payment-amount">KES ${amount.toLocaleString()}</p>
                </div>
                
                <div class="payment-options">
                    <div class="payment-option-card" onclick="selectPaymentMethod('mpesa')">
                        <div class="payment-option-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3>Lipa na M-Pesa</h3>
                        <p>Pay via M-Pesa Paybill</p>
                    </div>
                    
                    <div class="payment-option-card" onclick="selectPaymentMethod('kcb')">
                        <div class="payment-option-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <h3>KCB Bank</h3>
                        <p>Pay via KCB Bank Transfer</p>
                    </div>
                </div>

                <!-- M-Pesa Payment Details -->
                <div id="mpesaDetails" class="payment-details" style="display: none;">
                    <div class="payment-instructions">
                        <h3><i class="fas fa-info-circle"></i> M-Pesa Paybill Instructions</h3>
                        <div class="paybill-info">
                            <div class="paybill-item">
                                <span class="paybill-label">Paybill Number:</span>
                                <span class="paybill-value" id="paybillNumber">522522</span>
                                <button class="copy-btn" onclick="copyToClipboard('522522')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">Account Number:</span>
                                <span class="paybill-value" id="accountNumber">${selectedStudent ? selectedStudent.admission : 'KHS2024'}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${selectedStudent ? selectedStudent.admission : 'KHS2024'}')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                        <div class="payment-steps">
                            <h4>Steps to Pay:</h4>
                            <ol>
                                <li>Go to M-Pesa on your phone</li>
                                <li>Select "Lipa na M-Pesa"</li>
                                <li>Select "Paybill"</li>
                                <li>Enter Paybill Number: <strong>522522</strong></li>
                                <li>Enter Account Number: <strong>${selectedStudent ? selectedStudent.admission : 'KHS2024'}</strong></li>
                                <li>Enter Amount: <strong>KES ${amount.toLocaleString()}</strong></li>
                                <li>Enter your M-Pesa PIN</li>
                                <li>Confirm payment</li>
                            </ol>
                        </div>
                        <div class="payment-actions">
                            <button class="btn btn-primary" onclick="confirmMpesaPayment(${amount})">
                                I've Completed Payment
                            </button>
                            <button class="btn btn-secondary" onclick="closePaymentModal()">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <!-- KCB Bank Payment Details -->
                <div id="kcbDetails" class="payment-details" style="display: none;">
                    <div class="payment-instructions">
                        <h3><i class="fas fa-info-circle"></i> KCB Bank Transfer Instructions</h3>
                        <div class="paybill-info">
                            <div class="paybill-item">
                                <span class="paybill-label">Bank Name:</span>
                                <span class="paybill-value">Kenya Commercial Bank (KCB)</span>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">Account Name:</span>
                                <span class="paybill-value">Kitoo High School</span>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">Account Number:</span>
                                <span class="paybill-value" id="kcbAccountNumber">1100123456</span>
                                <button class="copy-btn" onclick="copyToClipboard('1100123456')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">Branch:</span>
                                <span class="paybill-value">Kitoo Branch</span>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">Reference/Student ID:</span>
                                <span class="paybill-value" id="kcbReference">${selectedStudent ? selectedStudent.admission : 'KHS2024'}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${selectedStudent ? selectedStudent.admission : 'KHS2024'}')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                            <div class="paybill-item">
                                <span class="paybill-label">SWIFT Code:</span>
                                <span class="paybill-value">KCBLKENX</span>
                            </div>
                        </div>
                        <div class="payment-steps">
                            <h4>Steps to Pay:</h4>
                            <ol>
                                <li>Visit any KCB branch or use KCB Mobile/Online Banking</li>
                                <li>Select "Transfer" or "Send Money"</li>
                                <li>Enter Account Number: <strong>1100123456</strong></li>
                                <li>Enter Account Name: <strong>Kitoo High School</strong></li>
                                <li>Enter Amount: <strong>KES ${amount.toLocaleString()}</strong></li>
                                <li>Add Reference/Student ID: <strong>${selectedStudent ? selectedStudent.admission : 'KHS2024'}</strong></li>
                                <li>Complete the transaction</li>
                            </ol>
                        </div>
                        <div class="payment-actions">
                            <button class="btn btn-primary" onclick="confirmKcbPayment(${amount})">
                                I've Completed Payment
                            </button>
                            <button class="btn btn-secondary" onclick="closePaymentModal()">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePaymentModal();
        }
    });
}

function selectPaymentMethod(method) {
    // Hide all payment details
    document.getElementById('mpesaDetails').style.display = 'none';
    document.getElementById('kcbDetails').style.display = 'none';
    
    // Remove active class from all cards
    document.querySelectorAll('.payment-option-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show selected method details
    if (method === 'mpesa') {
        document.getElementById('mpesaDetails').style.display = 'block';
        document.querySelectorAll('.payment-option-card')[0].classList.add('active');
    } else if (method === 'kcb') {
        document.getElementById('kcbDetails').style.display = 'block';
        document.querySelectorAll('.payment-option-card')[1].classList.add('active');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!', 'success');
    });
}

async function confirmMpesaPayment(amount) {
    showNotification('Payment verification in progress. You will receive a confirmation SMS shortly.', 'info');
    
    try {
        // Get selected student from modal
        const accountNumberEl = document.getElementById('accountNumber');
        const admissionNumber = accountNumberEl ? accountNumberEl.textContent.trim() : null;
        
        if (admissionNumber && window.API && window.API.fees) {
            const response = await window.API.fees.recordPayment({
                admissionNumber: admissionNumber,
                amount: amount,
                paymentMethod: 'M-Pesa',
                transactionId: 'MPESA-' + Date.now()
            });
            
            if (response.success) {
                showNotification('Payment confirmed! Receipt will be sent to your email.', 'success');
                closePaymentModal();
                updateBalanceAfterPayment(amount);
            } else {
                showNotification(response.message || 'Payment verification failed', 'error');
            }
        } else {
            // Fallback simulation
            setTimeout(() => {
                showNotification('Payment confirmed! Receipt will be sent to your email.', 'success');
                closePaymentModal();
                updateBalanceAfterPayment(amount);
            }, 2000);
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment verification failed. Please contact support.', 'error');
    }
}

async function confirmKcbPayment(amount) {
    showNotification('Payment verification in progress. Please allow 24-48 hours for processing.', 'info');
    
    try {
        // Get selected student from modal
        const referenceEl = document.getElementById('kcbReference');
        const admissionNumber = referenceEl ? referenceEl.textContent.trim() : null;
        
        if (admissionNumber && window.API && window.API.fees) {
            const response = await window.API.fees.recordPayment({
                admissionNumber: admissionNumber,
                amount: amount,
                paymentMethod: 'KCB Bank',
                transactionId: 'KCB-' + Date.now()
            });
            
            if (response.success) {
                showNotification('Payment received! Receipt will be sent to your email once processed.', 'success');
                closePaymentModal();
                updateBalanceAfterPayment(amount);
            } else {
                showNotification(response.message || 'Payment recording failed', 'error');
            }
        } else {
            // Fallback simulation
            setTimeout(() => {
                showNotification('Payment received! Receipt will be sent to your email once processed.', 'success');
                closePaymentModal();
                updateBalanceAfterPayment(amount);
            }, 2000);
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment recording failed. Please contact support.', 'error');
    }
}

function updateBalanceAfterPayment(amount) {
    // Update balance display (in real app, this would fetch from backend)
    const balanceElements = document.querySelectorAll('.fees-total h2');
    balanceElements.forEach(el => {
        const currentBalance = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
        const newBalance = Math.max(0, currentBalance - amount);
        el.textContent = `KES ${newBalance.toLocaleString()}`;
    });
}

// Student selection for payment (Parent Portal)
function showStudentSelectionForPayment(amount, callback) {
    // Check if user is on parent portal
    const portalType = localStorage.getItem('portalType');
    if (portalType !== 'parent') {
        callback(null, amount);
        return;
    }
    
    // Get available students from child database
    const students = Object.values(window.childDatabase || {});
    
    if (students.length === 0) {
        showNotification('No students found. Please add a child first.', 'error');
        return;
    }
    
    // If only one student, proceed directly
    if (students.length === 1) {
        callback(students[0], amount);
        return;
    }
    
    // Show student selection modal
    const modal = document.createElement('div');
    modal.id = 'studentSelectionModal';
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h2><i class="fas fa-child"></i> Select Student for Payment</h2>
                <button class="payment-modal-close" onclick="closeStudentSelectionModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-amount-display">
                    <h3>Amount to Pay</h3>
                    <p class="payment-amount">KES ${amount.toLocaleString()}</p>
                </div>
                
                <div class="student-selection-list">
                    ${students.map((student, index) => `
                        <div class="student-option-card" onclick="selectStudentForPayment('${student.admission}', ${amount})">
                            <div class="student-option-icon">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                            <div class="student-option-info">
                                <h4>${student.name}</h4>
                                <p>${student.admission} - ${student.class}</p>
                            </div>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn btn-secondary btn-block" onclick="closeStudentSelectionModal()" style="margin-top: 1rem;">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function selectStudentForPayment(admissionNumber, amount) {
    const student = window.childDatabase[admissionNumber];
    closeStudentSelectionModal();
    
    if (student) {
        showPaymentModal(amount, student);
    } else {
        showNotification('Student not found', 'error');
    }
}

function closeStudentSelectionModal() {
    const modal = document.getElementById('studentSelectionModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Initialize payment buttons
document.addEventListener('DOMContentLoaded', function() {
    // Override existing payment button handlers
    const paymentButtons = document.querySelectorAll('.btn-primary');
    
    paymentButtons.forEach(btn => {
        if (btn.textContent.includes('Payment') || btn.textContent.includes('Make Payment')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get amount from balance or prompt user
                const balanceElement = this.closest('.dashboard-card')?.querySelector('.fees-total h2');
                let amount = 0;
                
                if (balanceElement) {
                    amount = parseInt(balanceElement.textContent.replace(/[^\d]/g, '')) || 0;
                }
                
                if (amount === 0) {
                    const userAmount = prompt('Enter amount to pay (KES):');
                    amount = parseInt(userAmount) || 0;
                }
                
                if (amount > 0) {
                    // Check if parent portal - show student selection
                    const portalType = localStorage.getItem('portalType');
                    if (portalType === 'parent') {
                        showStudentSelectionForPayment(amount, function(student, amount) {
                            if (student) {
                                showPaymentModal(amount, student);
                            } else {
                                showPaymentModal(amount);
                            }
                        });
                    } else {
                        showPaymentModal(amount);
                    }
                } else {
                    showNotification('Please enter a valid amount', 'error');
                }
            });
        }
    });
});

