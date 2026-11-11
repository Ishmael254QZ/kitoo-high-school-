# Kitoo High School - School Management System Website

A complete, modern website template for Kitoo High School featuring a comprehensive School Management System (SMS) with multiple modules and portals.

##  Features

### Public Website
- **Home Page**: Hero section with school introduction
- **About Section**: Vision, mission, and values
- **Admission Module**: Online application form with document upload
- **System Modules Overview**: 12 comprehensive modules
- **Academics Section**: Curriculum and facilities information
- **Gallery**: School facilities showcase
- **Contact**: Contact form and school information

### Student Portal
- Login system
- Dashboard with statistics
- View timetable
- View and track assignments
- Check exam results and grades
- Monitor library books
- View fees balance
- Receive messages and notifications

### Parent Portal
- Login system
- Multiple children management
- View child's academic performance
- Check fees and make payments
- Monitor attendance
- Receive school messages
- Download report cards and receipts
- View class timetable

### Admin Portal
- Login system
- Comprehensive dashboard with statistics
- Quick actions for all modules
- View recent admissions
- Monitor library books (overdue tracking)
- Discipline case management
- Financial overview
- Upcoming events
- System alerts

## Project Structure

```
SMS/
├── index.html              # Main public website
├── student-portal.html     # Student portal page
├── parent-portal.html      # Parent portal page
├── admin-portal.html       # Admin portal page
├── css/
│   ├── styles.css          # Main stylesheet
│   └── portal.css          # Portal-specific styles
├── js/
│   ├── script.js           # Main JavaScript
│   └── portal.js           # Portal JavaScript
└── README.md               # This file
```

## 🚀 Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
2. **Access portals**: Click on "Portals" in the navigation menu and select:
   - Student Portal
   - Parent Portal
   - Admin Portal

## 🔐 Demo Login

The legacy static HTML portals use a demonstration-only login that accepts any credentials:
- **Student Portal**: Enter any Student ID and password
- **Parent Portal**: Enter any email and password
- **Admin Portal**: Enter any username and password

This demonstration login does not authenticate users and must not be used to protect real school data. The React admin portal uses the Express authentication API.

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Color Scheme**: Blue primary color with orange accents
- **Interactive Elements**: Hover effects, transitions, and animations
- **Font Awesome Icons**: Beautiful icons throughout the interface

## 📋 Modules Included

1. **Admission Module** - Online application system
2. **Student Registration** - Complete student profile management
3. **Staff Management** - Teacher and staff records
4. **Library Management** - Book catalog and tracking
5. **Academics Module** - Timetable and curriculum
6. **Exam & Results** - Grading and performance tracking
7. **Fees & Finance** - Payment tracking and management
8. **Hostel/Boarding** - Dormitory management
9. **Inventory Management** - Asset tracking
10. **Communication** - SMS/Email alerts
11. **Discipline Module** - Misconduct tracking
12. **Student & Parent Portals** - Personalized dashboards

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Interactive functionality
- **Font Awesome 6.4.0**: Icons library
- **LocalStorage**: For demo login persistence

## 🔄 Customization

### Changing Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color:rgb(20, 119, 165);      /* Main blue color */
    --secondary-color: #059669;    /* Green color */
    --accent-color: #f59e0b;       /* Orange accent */
}
```

### Adding Content
- Update school information in `index.html`
- Modify module descriptions in the modules section
- Update contact information in the footer

### Backend Integration
To connect to a real backend:
1. Update form submission handlers in `js/script.js`
2. Modify login handlers in `js/portal.js`
3. Add API endpoints for data fetching
4. Implement proper authentication with server-side sessions

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- The legacy static HTML pages remain available alongside the React frontend.
- Admission submissions require the Express API, MongoDB, and the required document uploads. Serve the static pages over HTTP (for example, with VS Code Live Server) rather than opening them as `file://`.
- The contact form opens a prefilled email in the visitor's default email application; it does not send the message itself.
- Image placeholders are used in the gallery. Replace with actual school photos.
- The legacy static portals still use localStorage for demonstration login state. Use proper server-side session management before production deployment.

## 🔒 Security Considerations

For production deployment:
- Implement proper authentication (JWT, OAuth, etc.)
- Add CSRF protection for forms
- Use HTTPS for all communications
- Sanitize all user inputs
- Implement rate limiting for login attempts
- Add proper session management
- Encrypt sensitive data

## 📞 Support

For questions or issues, please contact:
- **Email**: ishmaelmunyalo4@gmail.com
- **Website**: N/A 

## 📄 License

This template is created for Kitoo High School. Modify as needed for your institution.

---
