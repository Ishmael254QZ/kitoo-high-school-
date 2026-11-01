// ===================================
// Librarian Portal Functions
// ===================================

// Issue Book
async function handleIssueBook(e) {
    e.preventDefault();

    const admissionNumber = document.getElementById('issueStudentId').value;
    const bookId = document.getElementById('issueBookId').value;
    const dueDate = document.getElementById('issueDueDate').value;

    if (!admissionNumber || !bookId) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        if (window.API && window.API.library) {
            const response = await window.API.library.issueBook({
                admissionNumber,
                bookId,
                dueDate
            });

            if (response.success) {
                showNotification('Book issued successfully!', 'success');
                document.getElementById('issueBookForm').reset();
                closeIssueBookModal();
                // Optionally refresh issued books list
            } else {
                showNotification(response.message || 'Failed to issue book', 'error');
            }
        } else {
            // Fallback for demo
            showNotification('Book issued successfully (Demo mode)', 'success');
            document.getElementById('issueBookForm').reset();
            closeIssueBookModal();
        }
    } catch (error) {
        console.error('Issue book error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}

// Report Case
async function handleReportCase(e) {
    e.preventDefault();

    const title = document.getElementById('reportTitle').value;
    const details = document.getElementById('reportDetails').value;
    const studentId = document.getElementById('reportStudentId').value;

    if (!title || !details) {
        showNotification('Please fill in required fields', 'error');
        return;
    }

    try {
        if (window.API && window.API.library) {
            const response = await window.API.library.reportCase({
                title,
                description: details,
                studentId
            });

            if (response.success) {
                showNotification('Case reported to admin successfully!', 'success');
                document.getElementById('reportCaseForm').reset();
                closeReportCaseModal();
            } else {
                showNotification(response.message || 'Failed to report case', 'error');
            }
        } else {
            showNotification('Case reported successfully (Demo mode)', 'success');
            document.getElementById('reportCaseForm').reset();
            closeReportCaseModal();
        }
    } catch (error) {
        console.error('Report case error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}

// Modal Functions
function showIssueBookModal() {
    const modal = document.getElementById('issueBookModal');
    if (modal) modal.style.display = 'flex';
}

function closeIssueBookModal() {
    const modal = document.getElementById('issueBookModal');
    if (modal) modal.style.display = 'none';
}

function showReportCaseModal() {
    const modal = document.getElementById('reportCaseModal');
    if (modal) modal.style.display = 'flex';
}

function closeReportCaseModal() {
    const modal = document.getElementById('reportCaseModal');
    if (modal) modal.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Only run on librarian portal
    if (!window.location.pathname.includes('librarian-portal.html')) return;

    // Attach form listeners
    const issueForm = document.getElementById('issueBookForm');
    if (issueForm) issueForm.addEventListener('submit', handleIssueBook);

    const reportForm = document.getElementById('reportCaseForm');
    if (reportForm) reportForm.addEventListener('submit', handleReportCase);

    // Close modals on outside click
    window.addEventListener('click', function (e) {
        const issueModal = document.getElementById('issueBookModal');
        const reportModal = document.getElementById('reportCaseModal');

        if (e.target === issueModal) closeIssueBookModal();
        if (e.target === reportModal) closeReportCaseModal();
    });
});
