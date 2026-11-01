
// ===================================
// Password Recovery Logic
// ===================================

function showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        // Reset state
        document.getElementById('forgotPasswordStep1').style.display = 'block';
        document.getElementById('forgotPasswordStep2').style.display = 'none';
        document.getElementById('recoveryEmail').value = '';
        document.getElementById('recoveryPin').value = '';
    }
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    // Step 1: Send PIN
    const step1Form = document.getElementById('forgotPasswordStep1');
    if (step1Form) {
        step1Form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            const btn = step1Form.querySelector('button');
            const originalText = btn.textContent;

            try {
                btn.textContent = 'Sending...';
                btn.disabled = true;

                if (!window.API || !window.API.auth) {
                    throw new Error('Password recovery service is unavailable.');
                }
                const response = await window.API.auth.forgotPassword(email);
                document.getElementById('forgotPasswordStep1').style.display = 'none';
                document.getElementById('forgotPasswordStep2').style.display = 'block';
                alert(response.message || 'If an account exists for this email, a recovery PIN has been sent.');
            } catch (error) {
                console.error(error);
                alert(error.message || 'Error sending PIN request');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // Step 2: Verify PIN & Login
    const step2Form = document.getElementById('forgotPasswordStep2');
    if (step2Form) {
        step2Form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            const pin = document.getElementById('recoveryPin').value;
            const btn = step2Form.querySelector('button');
            const originalText = btn.textContent;

            try {
                btn.textContent = 'Verifying...';
                btn.disabled = true;

                if (!window.API || !window.API.auth) {
                    throw new Error('Password recovery service is unavailable.');
                }
                const response = await window.API.auth.loginWithPin(email, pin);
                localStorage.setItem('portalLoggedIn', 'true');
                localStorage.setItem('portalType', response.user.role);
                localStorage.setItem('portalCredentials', JSON.stringify({ email: response.user.email }));

                alert('Login successful.');
                closeForgotPasswordModal();
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert(error.message || 'Error verifying PIN');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // Close modal on outside click
    const recoveryModal = document.getElementById('forgotPasswordModal');
    if (recoveryModal) {
        recoveryModal.addEventListener('click', function (e) {
            if (e.target === recoveryModal) {
                closeForgotPasswordModal();
            }
        });
    }
});
