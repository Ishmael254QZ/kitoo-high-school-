import { useEffect, useState } from 'react'

const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) return undefined

    const controller = new AbortController()
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          signal: controller.signal
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load dashboard data.')
        }

        setDashboardData(result.data)
        setDashboardError('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDashboardError(error.message || 'Unable to load dashboard data.')
        }
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [isLoggedIn])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to sign in.')
      }

      if (result.user?.role !== 'admin') {
        throw new Error('This account does not have administrator access.')
      }
      if (!result.token) {
        throw new Error('The authentication service did not return a session token.')
      }

      localStorage.setItem('token', result.token)
      setIsLoggedIn(true)
    } catch (error) {
      setLoginError(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setDashboardData(null)
    setDashboardError('')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-shield text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Administrator access only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            {loginError && <p role="alert" className="text-sm text-red-700">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-60">
              {isLoggingIn ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <i className="fas fa-graduation-cap text-secondary text-xl"></i>
              <span className="font-bold text-gray-900">Admin Portal</span>
            </div>
            <button type="button" onClick={handleLogout} className="text-accent hover:text-accent-dark font-medium">
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage school operations and resources</p>
          {dashboardError && <p role="alert" className="mt-4 text-sm text-red-700">{dashboardError}</p>}
          {!dashboardData && !dashboardError && <p role="status" className="mt-4 text-sm text-gray-600">Loading dashboard data…</p>}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <i className="fas fa-users text-3xl text-secondary mb-3"></i>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.totalStudents?.toLocaleString() ?? '-'}</h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="card text-center">
            <i className="fas fa-chalkboard-teacher text-3xl text-secondary mb-3"></i>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.totalStaff?.toLocaleString() ?? '-'}</h3>
            <p className="text-gray-600">Staff Members</p>
          </div>
          <div className="card text-center">
            <i className="fas fa-money-bill-wave text-3xl text-secondary mb-3"></i>
            <h3 className="text-3xl font-bold text-gray-900">
              {dashboardData
                ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(dashboardData.collectedFees)
                : '-'}
            </h3>
            <p className="text-gray-600">Fees Collected</p>
          </div>
          <div className="card text-center">
            <i className="fas fa-exclamation-triangle text-3xl text-accent mb-3"></i>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.pendingAdmissions?.toLocaleString() ?? '-'}</h3>
            <p className="text-gray-600">Pending Admissions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'fas fa-user-plus', label: 'New Admission' },
              { icon: 'fas fa-user-edit', label: 'Register Student' },
              { icon: 'fas fa-clipboard-list', label: 'View Applications' },
              { icon: 'fas fa-book', label: 'Library Management' },
              { icon: 'fas fa-calendar-alt', label: 'Timetable' },
              { icon: 'fas fa-clipboard-check', label: 'Exam Results' },
              { icon: 'fas fa-money-bill-wave', label: 'Fees Management' },
              { icon: 'fas fa-chalkboard-teacher', label: 'Add Teacher/Staff' }
            ].map((action, index) => (
              <button key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-secondary transition-colors text-center">
                <i className={`${action.icon} text-secondary text-2xl mb-2 block`}></i>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPortal
