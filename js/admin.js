// ===================================
// Admin Portal Functions
// ===================================

function showStaffManagement() {
    // Check if user is admin
    const portalType = localStorage.getItem('portalType');
    if (portalType !== 'admin') {
        showNotification('Only administrators can add staff members', 'error');
        return;
    }

    const modal = document.getElementById('staffManagementModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeStaffManagement() {
    const modal = document.getElementById('staffManagementModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('addStaffForm');
        if (form) {
            form.reset();
        }
    }
}

// Handle add staff form
document.addEventListener('DOMContentLoaded', function () {
    const addStaffForm = document.getElementById('addStaffForm');

    if (addStaffForm) {
        addStaffForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const portalType = localStorage.getItem('portalType');
            if (portalType !== 'admin') {
                showNotification('Unauthorized: Only administrators can add staff', 'error');
                return;
            }

            const formData = {
                fullName: document.getElementById('staffName').value,
                staffId: document.getElementById('staffId').value,
                email: document.getElementById('staffEmail').value,
                phone: document.getElementById('staffPhone').value,
                role: document.getElementById('staffRole').value,
                department: document.getElementById('staffDepartment').value,
                password: document.getElementById('staffPassword').value
            };

            // Submit to backend API
            try {
                if (!window.API || !window.API.admin) {
                    throw new Error('Staff management service is unavailable.');
                }

                const response = await window.API.admin.addStaff(formData);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to add staff member');
                }

                showNotification('Staff member added successfully!', 'success');
                closeStaffManagement();
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                console.error('Add staff error:', error);
                showNotification(error.message || 'Failed to add staff member. Please try again.', 'error');
            }
        });
    }

    // Close modal on outside click
    const modal = document.getElementById('staffManagementModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeStaffManagement();
            }
        });
    }

    // New Event Listeners for Removal and Events
    const removeStudentForm = document.getElementById('removeStudentForm');
    if (removeStudentForm) {
        removeStudentForm.addEventListener('submit', handleRemoveStudent);
    }

    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', handleAddEvent);
    }

    const manageEventsModal = document.getElementById('manageEventsModal');
    if (manageEventsModal) {
        manageEventsModal.addEventListener('click', function (e) {
            if (e.target === manageEventsModal) {
                closeManageEventsModal();
            }
        });
    }

    const removeStudentModal = document.getElementById('removeStudentModal');
    if (removeStudentModal) {
        removeStudentModal.addEventListener('click', function (e) {
            if (e.target === removeStudentModal) {
                closeRemoveStudentModal();
            }
        });
    }
});

// Student Removal Functions
function showRemoveStudentModal() {
    const modal = document.getElementById('removeStudentModal');
    if (modal) modal.style.display = 'flex';
}

function closeRemoveStudentModal() {
    const modal = document.getElementById('removeStudentModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('removeStudentForm').reset();
    }
}

async function handleRemoveStudent(e) {
    e.preventDefault();
    const admissionNumber = document.getElementById('removeAdmissionNumber').value;

    if (!confirm(`Are you sure you want to remove student ${admissionNumber}? This cannot be undone.`)) {
        return;
    }

    try {
        if (!window.API || !window.API.students) {
            throw new Error('Student management service is unavailable.');
        }

        const response = await window.API.students.delete(admissionNumber);
        if (!response.success) {
            throw new Error(response.message || 'Failed to remove student');
        }

        showNotification('Student removed successfully', 'success');
        closeRemoveStudentModal();
    } catch (error) {
        console.error('Remove student error:', error);
        showNotification(error.message || 'Error removing student', 'error');
    }
}

// Event Management Functions
function showManageEventsModal() {
    const modal = document.getElementById('manageEventsModal');
    if (modal) {
        modal.style.display = 'flex';
        loadEventsList();
    }
}

function closeManageEventsModal() {
    const modal = document.getElementById('manageEventsModal');
    if (modal) modal.style.display = 'none';
}

async function loadEventsList() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        if (!window.API || !window.API.events) {
            throw new Error('Events service is unavailable.');
        }

        const response = await window.API.events.getAll();
        if (!response.success || !Array.isArray(response.data)) {
            throw new Error(response.message || 'Unable to load events.');
        }

        tbody.replaceChildren();

        if (response.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No events found</td></tr>';
            return;
        }

        response.data.forEach(event => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const titleCell = document.createElement('td');
            const locationCell = document.createElement('td');
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            const deleteIcon = document.createElement('i');
            const date = new Date(event.date);

            dateCell.textContent = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
            titleCell.textContent = event.title || '';
            locationCell.textContent = event.location || '';
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-sm btn-danger';
            deleteButton.setAttribute('aria-label', `Delete ${event.title || 'event'}`);
            deleteIcon.className = 'fas fa-trash';
            deleteIcon.setAttribute('aria-hidden', 'true');
            deleteButton.appendChild(deleteIcon);
            deleteButton.addEventListener('click', () => window.deleteEvent(event._id));
            actionCell.appendChild(deleteButton);
            row.append(dateCell, titleCell, locationCell, actionCell);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Load events error:', error);
        tbody.innerHTML = '<tr><td colspan="4">Error loading events</td></tr>';
        showNotification(error.message || 'Error loading events', 'error');
    }
}

async function handleAddEvent(e) {
    e.preventDefault();

    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value
    };

    try {
        if (!window.API || !window.API.events) {
            throw new Error('Events service is unavailable.');
        }

        const response = await window.API.events.create(eventData);
        if (!response.success) {
            throw new Error(response.message || 'Failed to create event');
        }

        showNotification('Event created successfully', 'success');
        document.getElementById('addEventForm').reset();
        await loadEventsList();
    } catch (error) {
        console.error('Create event error:', error);
        showNotification(error.message || 'Error creating event', 'error');
    }
}

window.deleteEvent = async function (id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        if (!window.API || !window.API.events) {
            throw new Error('Events service is unavailable.');
        }

        const response = await window.API.events.delete(id);
        if (!response.success) {
            throw new Error(response.message || 'Failed to delete event');
        }

        showNotification('Event deleted successfully', 'success');
        await loadEventsList();
    } catch (error) {
        console.error('Delete event error:', error);
        showNotification(error.message || 'Error deleting event', 'error');
    }
};
