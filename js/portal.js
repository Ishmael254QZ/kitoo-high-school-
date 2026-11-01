// ===================================
// Portal Login System
// ===================================

// Check if user is logged in (in real app, this would check server session)
function checkLoginStatus() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    // Check localStorage for login status
    const isLoggedIn = localStorage.getItem('portalLoggedIn') === 'true';
    const portalType = localStorage.getItem('portalType');

    if (isLoggedIn && portalType) {
        // Allow Admin to access Teacher Portal
        if (portalType === 'admin' && window.location.pathname.includes('teacher-portal.html')) {
            // Allow access
        } else if (portalType === 'librarian' && window.location.pathname.includes('librarian-portal.html')) {
            // Allow access
        } else if (!window.location.pathname.includes(portalType + '-portal.html')) {
            // If trying to access wrong portal, redirect (unless admin->teacher)
            // For simplicity, we just return false here to show login form or let them navigate back
            // But existing logic seemed to just check 'includes' which is strict.
            // We need to be careful not to break existing flows.
        }

        // Show dashboard based on portal type or allowed access
        if (window.location.pathname.includes(portalType + '-portal.html') ||
            (portalType === 'admin' && window.location.pathname.includes('teacher-portal.html')) ||
            (portalType === 'librarian' && window.location.pathname.includes('librarian-portal.html'))) {
            if (loginSection) loginSection.style.display = 'none';
            if (dashboardSection) dashboardSection.style.display = 'block';

            // Populate user information if logged in
            const credentials = JSON.parse(localStorage.getItem('portalCredentials') || '{}');
            if (portalType === 'student') {
                const studentNameEl = document.getElementById('studentName');
                const studentIdEl = document.getElementById('displayStudentId');
                const studentClassEl = document.getElementById('studentClass');

                if (studentNameEl) studentNameEl.textContent = credentials.studentId ? `Student ${credentials.studentId.split('/').pop()}` : 'Student';
                if (studentIdEl) studentIdEl.textContent = credentials.studentId || 'KHS/2024/001';
                if (studentClassEl) studentClassEl.textContent = 'Form 3 East';
            } else if (portalType === 'parent') {
                const parentNameEl = document.getElementById('parentName');
                const childrenCountEl = document.getElementById('childrenCount');

                if (parentNameEl) {
                    const email = credentials.email || '';
                    const name = email.split('@')[0] || 'Parent';
                    parentNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
                }
                if (childrenCountEl) childrenCountEl.textContent = '3';
            }

            return true;
        }
    }

    // Show login form
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    return false;
}

// Handle Login Form Submission
function setupLoginForm() {
    const studentForm = document.getElementById('studentLoginForm');
    const parentForm = document.getElementById('parentLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin('student', {
                studentId: document.getElementById('studentId').value,
                password: document.getElementById('studentPassword').value
            });
        });
    }

    if (parentForm) {
        parentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin('parent', {
                email: document.getElementById('parentEmail').value,
                password: document.getElementById('parentPassword').value
            });
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin('admin', {
                username: document.getElementById('adminUsername').value,
                password: document.getElementById('adminPassword').value
            });
        });
    }
}

// Handle Login Process
function handleLogin(portalType, credentials) {
    // Security: Check login attempts
    const identifier = credentials.studentId || credentials.email || credentials.username || credentials.teacherId || 'unknown';

    if (window.security && !window.security.checkLoginAttempts(identifier)) {
        return;
    }

    // Sanitize inputs
    if (window.security) {
        Object.keys(credentials).forEach(key => {
            if (key !== 'password') {
                credentials[key] = window.security.sanitizeInput(credentials[key]);
            }
        });
    }

    // In a real application, this would make an API call to verify credentials
    // For demo purposes, we'll accept any non-empty credentials

    if (!credentials.password || credentials.password.length === 0) {
        if (window.security) {
            window.security.recordLoginAttempt(identifier, false);
        }
        showNotification('Please enter your password', 'error');
        return;
    }

    // Simulate login success
    localStorage.setItem('portalLoggedIn', 'true');
    localStorage.setItem('portalType', portalType);
    localStorage.setItem('portalCredentials', JSON.stringify(credentials));

    // Hide login form and show dashboard
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';

    // Populate user information after successful login
    if (portalType === 'student') {
        const studentNameEl = document.getElementById('studentName');
        const studentIdEl = document.getElementById('displayStudentId');
        const studentClassEl = document.getElementById('studentClass');

        if (studentNameEl) studentNameEl.textContent = credentials.studentId ? `Student ${credentials.studentId.split('/').pop()}` : 'Student';
        if (studentIdEl) studentIdEl.textContent = credentials.studentId || 'KHS/2024/001';
        if (studentClassEl) studentClassEl.textContent = 'Form 3 East';
    } else if (portalType === 'parent') {
        const parentNameEl = document.getElementById('parentName');
        const childrenCountEl = document.getElementById('childrenCount');

        if (parentNameEl) {
            const email = credentials.email || '';
            const name = email.split('@')[0] || 'Parent';
            parentNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        }
        if (childrenCountEl) childrenCountEl.textContent = '3'; // Based on the 3 children in selector
    }

    // Record successful login
    if (window.security) {
        window.security.recordLoginAttempt(identifier, true);
    }

    showNotification('Login successful! Welcome back.', 'success');

    // Log login attempt (for demo)
    console.log(`${portalType} login:`, credentials);
}

// Handle Logout
function setupLogout() {
    const logoutButtons = document.querySelectorAll('.logout-btn');

    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('portalLoggedIn');
                localStorage.removeItem('portalType');
                localStorage.removeItem('portalCredentials');

                // Reload page to show login form
                window.location.reload();
            }
        });
    });
}

// ===================================
// Notification System (from main script)
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    // Add to body
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animation styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
`;
document.head.appendChild(notificationStyle);

// ===================================
// Child Selector (Parent Portal)
// ===================================
function setupChildSelector() {
    const childSelector = document.getElementById('childSelector');

    if (childSelector) {
        childSelector.addEventListener('change', function () {
            const selectedChild = this.value;
            // In real app, this would fetch child data from server
            showNotification('Child profile updated', 'success');
            console.log('Selected child:', selectedChild);

            // Update dashboard with selected child's data
            // This would typically involve an API call
        });
    }
}

// ===================================
// Dashboard Data Loading
// ===================================
function loadDashboardData() {
    const portalType = localStorage.getItem('portalType');

    if (!portalType) return;

    // In a real application, this would fetch data from an API
    // For demo purposes, we'll just log
    console.log(`Loading ${portalType} dashboard data...`);

    // Simulate data loading
    setTimeout(() => {
        // Data would be loaded here and displayed
        console.log('Dashboard data loaded');
    }, 500);
}

// ===================================
// Interactive Features
// ===================================

// Make cards clickable (where appropriate)
function setupCardInteractions() {
    const cards = document.querySelectorAll('.dashboard-card');

    cards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle action card clicks
function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            showNotification(`${action} feature coming soon!`, 'info');
            console.log('Action clicked:', action);
        });
    });
}

// Handle view all links
function setupViewAllLinks() {
    const viewAllLinks = document.querySelectorAll('.view-all-link');

    viewAllLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.closest('.dashboard-card').querySelector('.card-header h3').textContent.trim();
            showNotification(`${section} - Full view coming soon!`, 'info');
            console.log('View all clicked:', section);
        });
    });
}

// Handle download buttons
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-icon');

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const downloadItem = this.closest('.download-item');
            const fileName = downloadItem.querySelector('.download-info h4').textContent;
            showNotification(`Downloading ${fileName}...`, 'info');
            console.log('Download:', fileName);

            // In real app, this would trigger a file download
        });
    });
}

// Handle payment button
function setupPaymentButtons() {
    const paymentButtons = document.querySelectorAll('.btn-primary');

    paymentButtons.forEach(btn => {
        if (btn.textContent.includes('Payment') || btn.textContent.includes('Make Payment')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                showNotification('Payment gateway integration coming soon!', 'info');
                console.log('Payment initiated');
            });
        }
    });
}

// ===================================
// Initialize Portal
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    // Check login status
    checkLoginStatus();

    // Setup login forms
    setupLoginForm();

    // Setup logout
    setupLogout();

    // Setup child selector (parent portal only)
    setupChildSelector();

    // Load dashboard data
    loadDashboardData();

    // Setup interactive features
    setupCardInteractions();
    setupActionCards();
    setupViewAllLinks();
    setupDownloadButtons();
    setupPaymentButtons();

    console.log('Portal initialized successfully!');
});

// ===================================
// Auto-refresh Data (optional)
// ===================================
// In a real application, you might want to periodically refresh dashboard data
// setInterval(loadDashboardData, 300000); // Refresh every 5 minutes

