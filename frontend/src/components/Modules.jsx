const Modules = () => {
  const modules = [
    { icon: 'fas fa-user-plus', title: 'Admission Module', desc: 'Online application system with document upload and automated admission number generation.' },
    { icon: 'fas fa-address-card', title: 'Student Registration', desc: 'Complete student profile management, class assignment, and guardian contact records.' },
    { icon: 'fas fa-chalkboard-teacher', title: 'Staff Management', desc: 'Teacher and non-teaching staff records, payroll, attendance tracking, and role assignment.' },
    { icon: 'fas fa-book', title: 'Library Management', desc: 'Digital catalog, book issuance, return tracking, and automated overdue reminders.' },
    { icon: 'fas fa-graduation-cap', title: 'Academics Module', desc: 'Timetable generation, subject management, teacher allocation, and lesson attendance.' },
    { icon: 'fas fa-clipboard-check', title: 'Exam & Results', desc: 'Automated grading, performance analytics, report generation, and KCSE grading scale integration.' },
    { icon: 'fas fa-money-bill-wave', title: 'Fees & Finance', desc: 'Payment tracking, receipt generation, M-Pesa integration, bursary management, and SMS reminders.' },
    { icon: 'fas fa-bed', title: 'Hostel/Boarding', desc: 'Dormitory assignment, attendance tracking, house master reports, and inventory management.' },
    { icon: 'fas fa-boxes', title: 'Inventory Management', desc: 'Asset tracking, textbook inventory, stationery distribution, and maintenance reports.' },
    { icon: 'fas fa-comments', title: 'Communication', desc: 'SMS/Email alerts, notices to parents, announcements, and circular distribution.' },
    { icon: 'fas fa-gavel', title: 'Discipline Module', desc: 'Misconduct tracking, prefect reports, punishment records, and suspension management.' },
    { icon: 'fas fa-desktop', title: 'Student & Parent Portals', desc: 'Personalized dashboards for students and parents to access information and communicate.' }
  ]

  return (
    <section className="section-container bg-transparent">
      <div className="section-header">
        <h2 className="section-title">School Management System</h2>
        <p className="section-subtitle">Comprehensive digital solutions for modern education</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <div key={index} className="card group cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-secondary rounded-lg flex items-center justify-center mb-4 transition-colors">
              <i className={`${module.icon} text-secondary group-hover:text-white transition-colors`}></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{module.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Modules
