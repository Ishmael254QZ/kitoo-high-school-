// Seed script to create initial admin user
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kitoo_sms');
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: 'admin@kitoohighschool.ac.ke',
            username: 'admin',
            password: 'admin123', // Change this in production!
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@kitoohighschool.ac.ke');
        console.log('Password: admin123');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();

