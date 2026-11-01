// ===================================
// API Integration for Frontend
// ===================================

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Remove auth token
function removeAuthToken() {
    localStorage.removeItem('token');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication API
const authAPI = {
    login: async (email, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success && data.token) {
            setAuthToken(data.token);
        }

        return data;
    },

    register: async (userData) => {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    forgotPassword: async (email) => {
        return await apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    loginWithPin: async (email, pin) => {
        const data = await apiRequest('/auth/login-with-pin', {
            method: 'POST',
            body: JSON.stringify({ email, pin })
        });

        if (data.success && data.token) {
            setAuthToken(data.token);
        }

        return data;
    },

    getCurrentUser: async () => {
        return await apiRequest('/auth/me');
    },

    changePassword: async (currentPassword, newPassword) => {
        return await apiRequest('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    },

    logout: () => {
        removeAuthToken();
    }
};

// Students API
const studentsAPI = {
    search: async (admissionNumber) => {
        return await apiRequest(`/students/search/${admissionNumber}`);
    },

    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/students?${queryString}`);
    },

    delete: async (admissionNumber) => {
        return await apiRequest(`/students/${admissionNumber}`, {
            method: 'DELETE'
        });
    }
};

const admissionsAPI = {
    submit: async (formData) => {
        return await apiRequest('/admissions', {
            method: 'POST',
            body: formData
        });
    }
};

const adminAPI = {
    addStaff: async (staffData) => {
        return await apiRequest('/admin/staff', {
            method: 'POST',
            body: JSON.stringify(staffData)
        });
    }
};

const feesAPI = {
    recordPayment: async (paymentData) => {
        return await apiRequest('/fees/payment', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }
};

const teachersAPI = {
    addStudentInfo: async (studentInfo) => {
        return await apiRequest('/teachers/student-info', {
            method: 'POST',
            body: JSON.stringify(studentInfo)
        });
    }
};

// Events API
const eventsAPI = {
    getAll: async () => {
        return await apiRequest('/events');
    },

    create: async (eventData) => {
        return await apiRequest('/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    },

    update: async (id, eventData) => {
        return await apiRequest(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    },

    delete: async (id) => {
        return await apiRequest(`/events/${id}`, {
            method: 'DELETE'
        });
    }
};

// Library API
const libraryAPI = {
    getBooks: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/library/books?${queryString}`);
    },

    getStudentBooks: async (admissionNumber) => {
        return await apiRequest(`/library/student/${admissionNumber}`);
    },

    issueBook: async (data) => {
        return await apiRequest('/library/issue', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    reportCase: async (data) => {
        return await apiRequest('/library/report', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// Export all APIs
window.API = {
    auth: authAPI,
    students: studentsAPI,
    admissions: admissionsAPI,
    fees: feesAPI,
    events: eventsAPI,
    admin: adminAPI,
    library: libraryAPI,
    teachers: teachersAPI
};
