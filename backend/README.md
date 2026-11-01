# Kitoo High School SMS - Backend API

Backend API for the Kitoo High School Management System built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   - MongoDB connection string
   - JWT secret key
   - Email configuration (optional)
   - Other settings

3. **Start MongoDB**
   - Local: Make sure MongoDB is running on `mongodb://localhost:27017`
   - Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

4. **Run the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── models/          # MongoDB models
│   ├── User.js
│   ├── Student.js
│   ├── Parent.js
│   ├── Teacher.js
│   ├── Admission.js
│   ├── Fee.js
│   ├── Assignment.js
│   ├── Result.js
│   ├── Notice.js
│   └── Library.js
├── routes/          # API routes
│   ├── auth.js
│   ├── students.js
│   ├── parents.js
│   ├── teachers.js
│   ├── admin.js
│   ├── admissions.js
│   ├── fees.js
│   ├── library.js
│   ├── assignments.js
│   ├── results.js
│   └── notices.js
├── middleware/      # Custom middleware
│   ├── auth.js
│   └── upload.js
├── server.js        # Main server file
├── package.json
└── .env             # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Students
- `GET /api/students` - Get all students (admin/teacher)
- `GET /api/students/search/:admissionNumber` - Search student
- `POST /api/students` - Create student (admin)

### Parents
- `GET /api/parents/children` - Get parent's children
- `GET /api/parents/child/:admissionNumber` - Get child details

### Teachers
- `POST /api/teachers/student-info` - Add student information
- `GET /api/teachers/classes` - Get teacher's classes

### Admin
- `POST /api/admin/staff` - Add new staff member
- `GET /api/admin/staff` - Get all staff
- `GET /api/admin/dashboard` - Get dashboard statistics

### Admissions
- `POST /api/admissions` - Submit admission application
- `GET /api/admissions` - Get all admissions (admin)
- `PUT /api/admissions/:id/approve` - Approve admission (admin)

### Fees
- `GET /api/fees/student/:admissionNumber` - Get student fees
- `POST /api/fees/payment` - Record payment
- `POST /api/fees` - Create fee record (admin)

### Library
- `GET /api/library/books` - Get all books
- `GET /api/library/student/:admissionNumber` - Get student's books

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (teacher)

### Results
- `GET /api/results/student/:admissionNumber` - Get student results
- `POST /api/results` - Add results (teacher/admin)

### Notices
- `GET /api/notices` - Get active notices
- `POST /api/notices` - Create notice (admin/teacher)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📝 Example API Calls

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kitoohighschool.ac.ke",
    "password": "password123"
  }'
```

### Get Student Fees (with token)
```bash
curl -X GET http://localhost:3000/api/fees/student/KHS/2024/001 \
  -H "Authorization: Bearer <your-token>"
```

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- File upload validation

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **multer** - File uploads
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - CORS middleware
- **express-rate-limit** - Rate limiting

## 🔄 Integration with Frontend

Update your frontend JavaScript files to use the API:

```javascript
// Example: Login
async function login(email, password) {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
        localStorage.setItem('token', data.token);
        // Handle success
    }
}

// Example: Authenticated request
async function getStudentFees(admissionNumber) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/fees/student/${admissionNumber}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
}
```

## 🚨 Important Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Set proper CORS** origins
4. **Configure email** for notifications
5. **Set up MongoDB** backup strategy
6. **Use environment variables** for all secrets

## 📄 License

This backend is part of the Kitoo High School Management System.

