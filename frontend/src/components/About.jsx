const About = () => {
  const items = [
    {
      icon: 'fas fa-eye',
      title: 'Our Vision',
      description: 'To be a center of academic excellence that nurtures holistic development and produces responsible citizens who contribute positively to society.'
    },
    {
      icon: 'fas fa-bullseye',
      title: 'Our Mission',
      description: 'To provide quality education through innovative teaching methods, modern facilities, and a supportive environment that enables students to achieve their full potential.'
    },
    {
      icon: 'fas fa-star',
      title: 'Our Values',
      description: 'Integrity, Excellence, Discipline, Innovation, and Respect - the core values that guide our daily interactions and educational practices.'
    }
  ]

  return (
    <section id="about" className="section-container bg-transparent">
      <div className="section-header">
        <h2 className="section-title">About Our School</h2>
        <p className="section-subtitle">Empowering students for a bright future</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div key={index} className="card text-center hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${item.icon} text-white text-2xl`}></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default About
