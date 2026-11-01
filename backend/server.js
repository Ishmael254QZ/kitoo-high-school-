const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const parentRoutes = require('./routes/parents');
const teacherRoutes = require('./routes/teachers');
const adminRoutes = require('./routes/admin');
const admissionRoutes = require('./routes/admissions');
const feesRoutes = require('./routes/fees');
const libraryRoutes = require('./routes/library');
const assignmentRoutes = require('./routes/assignments');
const resultsRoutes = require('./routes/results');
const noticeRoutes = require('./routes/notices');
const eventRoutes = require('./routes/events');

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Strict rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.'
});
app.use(['/api/auth/login', '/api/auth/forgot-password', '/api/auth/login-with-pin'], authLimiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kitoo_sms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// External Service URLs
const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000';
const PHP_API_URL = process.env.PHP_API_URL || 'http://localhost:8080';

// Proxy routes to Django backend (Reports & Analytics)
app.get('/api/reports/*', async (req, res) => {
    try {
        const path = req.path.replace('/api', '');
        const response = await axios.get(`${DJANGO_API_URL}${path}`, {
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.message || 'Error connecting to Django service'
        });
    }
});

// Proxy routes to PHP backend (Payments & Reports)
app.all('/api/payments/*', async (req, res) => {
    try {
        const path = req.path.replace('/api', '');
        const config = {
            method: req.method.toLowerCase(),
            url: `${PHP_API_URL}${path}`,
            headers: { 'Content-Type': 'application/json' }
        };

        if (req.method === 'POST' || req.method === 'PUT') {
            config.data = req.body;
        }

        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.message || 'Error connecting to PHP service'
        });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Kitoo High School SMS API is running',
        timestamp: new Date().toISOString(),
        services: {
            django: DJANGO_API_URL,
            php: PHP_API_URL
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;
