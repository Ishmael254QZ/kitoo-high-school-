import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Library = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Library Management</h1>
          <p className="text-gray-600">Library management system coming soon with React + Tailwind CSS</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Library
