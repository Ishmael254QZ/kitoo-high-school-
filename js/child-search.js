// ===================================
// Child Search System
// ===================================

// Sample child database (fallback if API not available)
window.childDatabase = {
    'KHS/2024/001': {
        name: 'Jane Doe',
        admission: 'KHS/2024/001',
        class: 'Form 3 East',
        form: 'Form 3',
        stream: 'East',
        dob: '2008-05-15',
        guardian: 'Mr. John Doe',
        phone: '+254 700 000 000',
        email: 'john.doe@example.com'
    },
    'KHS/2023/045': {
        name: 'John Doe Jr.',
        admission: 'KHS/2023/045',
        class: 'Form 2 West',
        form: 'Form 2',
        stream: 'West',
        dob: '2007-08-20',
        guardian: 'Mr. John Doe',
        phone: '+254 700 000 000',
        email: 'john.doe@example.com'
    },
    'KHS/2022/123': {
        name: 'Sarah Doe',
        admission: 'KHS/2022/123',
        class: 'Form 4 North',
        form: 'Form 4',
        stream: 'North',
        dob: '2006-03-10',
        guardian: 'Mr. John Doe',
        phone: '+254 700 000 000',
        email: 'john.doe@example.com'
    }
};

async function searchChild() {
    const searchInput = document.getElementById('childSearchInput');
    const admissionNumber = searchInput.value.trim().toUpperCase();
    const childInfoDisplay = document.getElementById('childInfoDisplay');
    
    if (!admissionNumber) {
        showNotification('Please enter an admission number', 'error');
        return;
    }
    
    try {
        let child;
        
        // Try API first
        if (window.API && window.API.students) {
            try {
                const response = await window.API.students.search(admissionNumber);
                if (response.success && response.data) {
                    child = {
                        name: response.data.fullName,
                        admission: response.data.admissionNumber,
                        class: response.data.class,
                        form: response.data.form,
                        stream: response.data.stream,
                        dob: response.data.dateOfBirth,
                        guardian: response.data.parentId ? response.data.parentId.fullName : 'N/A'
                    };
                }
            } catch (apiError) {
                console.log('API not available, using fallback');
            }
        }
        
        // Fallback to local database
        if (!child) {
            child = window.childDatabase[admissionNumber];
        }
        
        if (child) {
            // Display child information
            document.getElementById('childName').textContent = child.name;
            document.getElementById('childAdmission').textContent = child.admission;
            document.getElementById('childClass').textContent = child.class;
            document.getElementById('childForm').textContent = child.form;
            document.getElementById('childStream').textContent = child.stream;
            document.getElementById('childDob').textContent = formatDate(child.dob);
            document.getElementById('childGuardian').textContent = child.guardian;
            
            childInfoDisplay.style.display = 'block';
            showNotification('Child information found!', 'success');
            
            // Update dashboard with selected child's data
            updateDashboardForChild(child);
        } else {
            childInfoDisplay.style.display = 'none';
            showNotification('Child not found. Please check the admission number.', 'error');
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Error searching for child. Please try again.', 'error');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateDashboardForChild(child) {
    // Update fees section with child's balance
    const balanceElements = document.querySelectorAll('.fees-total h2');
    balanceElements.forEach(el => {
        // In real app, this would fetch from backend based on child admission
        el.textContent = 'KES 0';
    });
    
    // Update other dashboard sections with child's data
    // This would be expanded in a real application
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('childSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchChild();
            }
        });
    }
});

