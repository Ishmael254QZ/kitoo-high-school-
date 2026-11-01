# Kitoo High School SMS - Modernized Architecture

## 🎨 Modern Tech Stack

This project has been modernized with a comprehensive tech stack:

### Frontend
- **React 18** - Modern UI library for building interactive components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing

### Backend (Microservices Architecture)
- **Node.js + Express** - Main API server (REST API)
- **Django** - Analytics and Reports microservice
- **PHP** - Payment processing and document generation microservice
- **MongoDB** - Primary database

## 🎨 Design Updates

### Color Scheme
- **Changed from blue to white-gray theme**
- Primary colors: Gray shades (#4B5563, #374151, #9CA3AF)
- Secondary: Emerald green (#059669)
- Accent: Amber (#F59E0B)
- Background: White and light gray (#FFFFFF, #F9FAFB, #F3F4F6)

### Modern UI Features
- Clean, minimalist design
- Smooth animations and transitions
- Responsive layouts
- Modern card-based components
- Improved typography with Inter font

## 📁 Project Structure

```
SMS/
├── frontend/                 # React + Tailwind Frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API
│   ├── routes/              # API routes
│   ├── models/              # MongoDB models
│   ├── middleware/          # Express middleware
│   └── server.js            # Main server file
│
├── django-backend/          # Django Analytics Service
│   ├── reports/             # Reports app
│   ├── sms_reports/         # Django project settings
│   └── requirements.txt
│
└── php-backend/             # PHP Payment Service
    ├── routes/              # Payment & report routes
    └── config/              # Configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ (for Django)
- PHP 7.4+ (for PHP backend)
- MongoDB
- MongoDB PHP extension (for PHP backend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3001`

### Express Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

### Django Backend Setup

```bash
cd django-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Django will run on `http://localhost:8000`

### PHP Backend Setup

1. Configure your web server (Apache/Nginx) to point to `php-backend/` directory
2. Ensure MongoDB PHP extension is installed
3. Set up environment variables:
   ```bash
   export MONGODB_URI="mongodb://localhost:27017"
   ```

Or use PHP built-in server for development:
```bash
cd php-backend
php -S localhost:8080
```

## 🔌 API Integration

### Express Backend Routes
- `/api/auth/*` - Authentication
- `/api/students/*` - Student management
- `/api/parents/*` - Parent management
- `/api/teachers/*` - Teacher management
- `/api/admin/*` - Admin operations
- `/api/admissions/*` - Admissions
- `/api/fees/*` - Fee management
- `/api/library/*` - Library management

### Django Backend Routes (Proxied through Express)
- `/api/reports/student-performance/` - Student performance analytics
- `/api/reports/fee-collection/` - Fee collection reports
- `/api/reports/kcse-analytics/` - KCSE performance analytics

### PHP Backend Routes (Proxied through Express)
- `/api/payments/initiate` - Initiate payment (M-Pesa)
- `/api/payments/mpesa-callback` - M-Pesa callback handler
- `/api/payments/status` - Check payment status
- `/api/reports/fees-pdf` - Generate fees PDF
- `/api/reports/results-excel` - Generate results Excel

## 🎯 Features

### React Frontend
- ✅ Modern component-based architecture
- ✅ Responsive design with Tailwind CSS
- ✅ Client-side routing
- ✅ Form handling and validation
- ✅ API integration with axios

### Express Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ File uploads
- ✅ Rate limiting
- ✅ Security middleware (Helmet)
- ✅ Service proxying (Django & PHP)

### Django Backend
- ✅ Analytics and reporting
- ✅ Data aggregation
- ✅ Performance metrics
- ✅ KCSE analytics

### PHP Backend
- ✅ Payment processing
- ✅ M-Pesa integration (ready for implementation)
- ✅ PDF/Excel generation (ready for implementation)
- ✅ Document generation

## 📝 Environment Variables

Create `.env` files in respective directories:

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/kitoo_sms
JWT_SECRET=your-secret-key
PORT=3000
FRONTEND_URL=http://localhost:3001
DJANGO_API_URL=http://localhost:8000
PHP_API_URL=http://localhost:8080
```

### Django Backend (.env)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
MONGODB_URI=mongodb://localhost:27017/kitoo_sms
```

## 🎨 Color Palette

### Primary Colors (Gray)
- Primary: `#4B5563` (Gray-600)
- Primary Dark: `#374151` (Gray-700)
- Primary Light: `#9CA3AF` (Gray-400)

### Secondary Colors
- Secondary: `#059669` (Emerald-600)
- Secondary Light: `#10B981` (Emerald-500)
- Secondary Dark: `#047857` (Emerald-700)

### Accent Colors
- Accent: `#F59E0B` (Amber-500)
- Accent Light: `#FBBF24` (Amber-400)
- Accent Dark: `#D97706` (Amber-600)

### Background Colors
- White: `#FFFFFF`
- Light Gray: `#F9FAFB` (Gray-50)
- Gray: `#F3F4F6` (Gray-100)
- Dark Gray: `#E5E7EB` (Gray-200)

## 🔄 Migration from Old System

The old HTML/CSS/JS files are still available in the root directory for reference. The new React frontend is in the `frontend/` directory. You can gradually migrate features or run both in parallel.

## 📚 Documentation

- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Django REST Framework: https://www.django-rest-framework.org
- Express.js: https://expressjs.com

## 🤝 Contributing

1. Frontend changes: `frontend/` directory
2. API changes: `backend/` directory
3. Analytics: `django-backend/` directory
4. Payments: `php-backend/` directory

## 📄 License

Same as main project license.
