// ===================================
// Teacher Portal Functions
// ===================================

// Handle teacher login
function setupTeacherLogin() {
    const teacherForm = document.getElementById('teacherLoginForm');
    
    if (teacherForm) {
        teacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin('teacher', {
                teacherId: document.getElementById('teacherId').value,
                password: document.getElementById('teacherPassword').value
            });
        });
    }
}

// Show add student info form
function showAddStudentInfo() {
    const form = document.getElementById('addStudentInfoForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Handle add student information form
document.addEventListener('DOMContentLoaded', function() {
    setupTeacherLogin();
    
    const addStudentForm = document.getElementById('addStudentInfoForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                admissionNumber: document.getElementById('studentAdmission').value,
                subject: document.getElementById('studentSubject').value,
                grade: document.getElementById('studentGrade').value,
                remarks: document.getElementById('studentRemarks').value
            };
            
            // Submit to backend API
            try {
                if (!window.API || !window.API.teachers) {
                    throw new Error('Student information service is unavailable.');
                }

                const response = await window.API.teachers.addStudentInfo(formData);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to save student information');
                }

                showNotification('Student information saved successfully!', 'success');
                this.reset();
            } catch (error) {
                console.error('Save error:', error);
                showNotification(error.message || 'Failed to save student information. Please try again.', 'error');
            }
        });
    }
    
    // Update teacher name after login
    const portalType = localStorage.getItem('portalType');
    if (portalType === 'teacher') {
        const credentials = JSON.parse(localStorage.getItem('portalCredentials') || '{}');
        const teacherNameEl = document.getElementById('teacherName');
        if (teacherNameEl && credentials.teacherId) {
            teacherNameEl.textContent = credentials.teacherId;
        }
    }
});

// Update checkLoginStatus to handle teacher portal
const originalCheckLoginStatus = window.checkLoginStatus;
if (originalCheckLoginStatus) {
    window.checkLoginStatus = function() {
        const result = originalCheckLoginStatus();
        const portalType = localStorage.getItem('portalType');
        
        if (portalType === 'teacher') {
            const credentials = JSON.parse(localStorage.getItem('portalCredentials') || '{}');
            const teacherNameEl = document.getElementById('teacherName');
            if (teacherNameEl && credentials.teacherId) {
                teacherNameEl.textContent = credentials.teacherId;
            }
        }
        
        return result;
    };
}
