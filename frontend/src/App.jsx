import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AdminPortal from './pages/AdminPortal'
import StudentPortal from './pages/StudentPortal'
import ParentPortal from './pages/ParentPortal'
import TeacherPortal from './pages/TeacherPortal'
import Library from './pages/Library'

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/parent-portal" element={<ParentPortal />} />
        <Route path="/teacher-portal" element={<TeacherPortal />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<main className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-gray-900">Page not found</h1><Link to="/" className="mt-4 inline-block text-secondary hover:underline">Return to home</Link></main>} />
      </Routes>
    </>
  )
}

export default App
