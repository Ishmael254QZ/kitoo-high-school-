# Quick Start Guide - Modernized Kitoo SMS

## 🚀 Quick Setup

### 1. Frontend (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```
**Access at:** http://localhost:3001

### 2. Express Backend (Main API)

```bash
cd backend
npm install
npm run dev
```
**Access at:** http://localhost:3000

### 3. Django Backend (Analytics)

```bash
cd django-backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
**Access at:** http://localhost:8000

### 4. PHP Backend (Payments)

```bash
cd php-backend
php -S localhost:8080
```
**Access at:** http://localhost:8080

## 🎨 What's New

✅ **React Frontend** - Modern component-based UI  
✅ **Tailwind CSS** - Utility-first styling  
✅ **White-Gray Theme** - Replaced blue backgrounds  
✅ **Django Microservice** - Analytics & Reports  
✅ **PHP Microservice** - Payment Processing  
✅ **Modern Design** - Clean, professional interface  

## 📱 Key Features

- **Frontend:** React components with Tailwind CSS
- **Backend:** Node.js/Express, Django, PHP microservices
- **Database:** MongoDB (shared across services)
- **Design:** Modern white-gray color scheme

## 🔧 Environment Setup

Create `.env` in `backend/`:
```
MONGODB_URI=mongodb://localhost:27017/kitoo_sms
JWT_SECRET=your-secret-key
PORT=3000
DJANGO_API_URL=http://localhost:8000
PHP_API_URL=http://localhost:8080
```

## 📚 Full Documentation

See `README-MODERNIZATION.md` for complete documentation.
