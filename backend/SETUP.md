# Backend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   Create `backend/.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key for JWT tokens
   - `PORT` - Server port (default: 3000)
   - `FRONTEND_URL` - Allowed origin for the static site (default: `http://localhost:5500`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Required to send password-recovery PINs
   - `SMTP_SECURE` - Set to `true` when the SMTP connection uses TLS
   - `SMTP_FROM` - Optional sender address (defaults to `SMTP_USER`)

   Password recovery returns a configuration error until SMTP is set up. Recovery PINs are emailed and expire after 10 minutes.

3. **Start MongoDB**
   - Local: Install and start MongoDB
   - Cloud: Use MongoDB Atlas and get connection string

4. **Create Admin User**
   ```bash
   node scripts/seed.js
   ```
   Default admin credentials:
   - Email: `admin@kitoohighschool.ac.ke`
   - Password: `admin123`
   ⚠️ **Change password immediately after first login!**

5. **Start Server**
   ```bash
   npm run dev    # Development mode
   # or
   npm start      # Production mode
   ```

6. **Test API**
   Visit: `http://localhost:3000/api/health`

## Frontend Integration

Update `js/api.js` with your backend URL:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## API Documentation

See `README.md` for complete API documentation.
