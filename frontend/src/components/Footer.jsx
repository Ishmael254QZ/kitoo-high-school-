import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Kitoo High School</h3>
            <p className="mb-4">Excellence in Education Since 1985</p>
            <div className="flex gap-4">
              <a href="mailto:info@kitoohighschool.ac.ke" aria-label="Email Kitoo High School" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <i className="fas fa-envelope" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/#admission" className="hover:text-white transition-colors">Admission</Link></li>
              <li><Link to="/#academics" className="hover:text-white transition-colors">Academics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/student-portal" className="hover:text-white transition-colors">Student Portal</Link></li>
              <li><Link to="/parent-portal" className="hover:text-white transition-colors">Parent Portal</Link></li>
              <li><Link to="/admin-portal" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/#admission" className="hover:text-white transition-colors">Admission Application</Link></li>
              <li><Link to="/#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 Kitoo High School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
