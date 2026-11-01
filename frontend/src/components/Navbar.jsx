import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }

  return (
    <nav aria-label="Main navigation" className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-dark">
            <i className="fas fa-graduation-cap text-2xl text-secondary"></i>
            <span>Kitoo High School</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              Home
            </Link>
            <Link to="/#about" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              About
            </Link>
            <Link to="/#admission" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              Admission
            </Link>
            <Link to="/#academics" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              Academics
            </Link>
            <Link to="/library" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              Library
            </Link>
            
            {/* Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setIsDropdownOpen(false)
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-secondary font-medium transition-colors"
              >
                Portals <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2" onClick={closeMenus}>
                  <Link to="/student-portal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    Student Portal
                  </Link>
                  <Link to="/parent-portal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    Parent Portal
                  </Link>
                  <Link to="/teacher-portal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    Teacher Portal
                  </Link>
                  <Link to="/admin-portal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    Admin Portal
                  </Link>
                </div>
              )}
            </div>

            <Link to="/#contact" className="text-gray-700 hover:text-secondary font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 space-y-2">
            <Link to="/" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Home</Link>
            <Link to="/#about" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">About</Link>
            <Link to="/#admission" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Admission</Link>
            <Link to="/#academics" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Academics</Link>
            <Link to="/library" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Library</Link>
            <Link to="/student-portal" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Student Portal</Link>
            <Link to="/parent-portal" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Parent Portal</Link>
            <Link to="/teacher-portal" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Teacher Portal</Link>
            <Link to="/admin-portal" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Admin Portal</Link>
            <Link to="/#contact" onClick={closeMenus} className="block py-2 text-gray-700 hover:text-secondary">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
