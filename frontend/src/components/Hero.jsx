const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up drop-shadow-2xl">
          Welcome to <span className="text-secondary">Kitoo</span> High School
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up animation-delay-200 drop-shadow-lg">
          Excellence in Education Since 2013
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <a href="#admission" className="btn-accent">
            Apply Now
          </a>
          <a href="#about" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-white text-2xl drop-shadow-lg"></i>
      </div>
    </section>
  )
}

export default Hero
