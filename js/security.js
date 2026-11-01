// ===================================
// Security Features
// ===================================

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkLoginAttempts(identifier) {
    const attempts = loginAttempts.get(identifier) || { count: 0, lockoutUntil: null };
    
    if (attempts.lockoutUntil && Date.now() < attempts.lockoutUntil) {
        const remainingMinutes = Math.ceil((attempts.lockoutUntil - Date.now()) / 60000);
        showNotification(`Too many login attempts. Please try again in ${remainingMinutes} minute(s).`, 'error');
        return false;
    }
    
    if (attempts.lockoutUntil && Date.now() >= attempts.lockoutUntil) {
        // Reset after lockout period
        loginAttempts.set(identifier, { count: 0, lockoutUntil: null });
    }
    
    return true;
}

function recordLoginAttempt(identifier, success) {
    if (success) {
        // Reset on successful login
        loginAttempts.delete(identifier);
        return;
    }
    
    const attempts = loginAttempts.get(identifier) || { count: 0, lockoutUntil: null };
    attempts.count++;
    
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        attempts.lockoutUntil = Date.now() + LOCKOUT_DURATION;
        showNotification('Too many failed login attempts. Account locked for 15 minutes.', 'error');
    } else {
        const remaining = MAX_LOGIN_ATTEMPTS - attempts.count;
        showNotification(`Invalid credentials. ${remaining} attempt(s) remaining.`, 'error');
    }
    
    loginAttempts.set(identifier, attempts);
}

// Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>]/g, '')
        .trim();
}

// XSS Protection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// CSRF Token (for forms - in real app, generate server-side)
function getCSRFToken() {
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
        token = generateToken();
        sessionStorage.setItem('csrf_token', token);
    }
    return token;
}

function generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Session timeout
let sessionTimeout;
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        if (localStorage.getItem('portalLoggedIn') === 'true') {
            showNotification('Session expired. Please login again.', 'info');
            localStorage.removeItem('portalLoggedIn');
            localStorage.removeItem('portalType');
            localStorage.removeItem('portalCredentials');
            window.location.reload();
        }
    }, SESSION_DURATION);
}

// Initialize security features
document.addEventListener('DOMContentLoaded', function() {
    // Reset session timeout on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimeout, { passive: true });
    });
    
    resetSessionTimeout();
    
    // Sanitize all form inputs
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.type !== 'password' && this.type !== 'file') {
                this.value = sanitizeInput(this.value);
            }
        });
    });
});

// Export functions for use in other scripts
window.security = {
    checkLoginAttempts,
    recordLoginAttempt,
    sanitizeInput,
    escapeHtml,
    getCSRFToken
};

