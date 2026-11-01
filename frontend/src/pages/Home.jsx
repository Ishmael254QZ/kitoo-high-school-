import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Modules from '../components/Modules'
import Admission from '../components/Admission'
import Academics from '../components/Academics'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />
      <Hero />
      <About />
      <Modules />
      <Admission />
      <Academics />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
