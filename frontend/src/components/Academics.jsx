const Academics = () => {
  const kcseData = [
    {
      year: '2023',
      meanScore: '8.2',
      students: '245',
      aPlain: '15',
      aMinus: '28',
      bPlus: '45',
      universityEntry: '78%',
      latest: true
    },
    {
      year: '2022',
      meanScore: '7.9',
      students: '238',
      aPlain: '12',
      aMinus: '25',
      bPlus: '42',
      universityEntry: '75%',
      latest: false
    },
    {
      year: '2021',
      meanScore: '7.6',
      students: '230',
      aPlain: '10',
      aMinus: '22',
      bPlus: '38',
      universityEntry: '72%',
      latest: false
    },
    {
      year: '2020',
      meanScore: '7.4',
      students: '225',
      aPlain: '8',
      aMinus: '20',
      bPlus: '35',
      universityEntry: '70%',
      latest: false
    }
  ]

  const academicsItems = [
    { icon: 'fas fa-book-reader', title: 'Curriculum', desc: 'Following the Kenyan National Curriculum with emphasis on STEM subjects, languages, and humanities.' },
    { icon: 'fas fa-users', title: 'Class Structure', desc: 'Form 1 to Form 4 with multiple streams (North, South, East, West) for better student-teacher ratio.' },
    { icon: 'fas fa-laptop', title: 'Modern Facilities', desc: 'State-of-the-art computer labs, science laboratories, library, and multimedia classrooms.' },
    { icon: 'fas fa-chart-line', title: 'Performance Tracking', desc: 'Regular assessments, progress reports, and data-driven improvements in teaching methods.' }
  ]

  return (
    <section id="academics" className="section-container bg-transparent">
      <div className="section-header">
        <h2 className="section-title">Academic Excellence</h2>
        <p className="section-subtitle">Comprehensive curriculum and modern teaching methods</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {academicsItems.map((item, index) => (
          <div key={index} className="card text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className={`${item.icon} text-white text-xl`}></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* KCSE Performance */}
      <div className="mt-16">
        <div className="section-header mb-12">
          <h2 className="section-title">KCSE Performance by Year</h2>
          <p className="section-subtitle">Our track record of academic excellence</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kcseData.map((data) => (
            <div key={data.year} className="card hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{data.year}</h3>
                {data.latest && (
                  <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded">Latest</span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Mean Score</span>
                  <span className="font-bold text-gray-900">{data.meanScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Students</span>
                  <span className="font-bold text-gray-900">{data.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">A (Plain)</span>
                  <span className="font-bold text-secondary">{data.aPlain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">A- (Minus)</span>
                  <span className="font-bold text-secondary">{data.aMinus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">B+ (Plus)</span>
                  <span className="font-bold text-secondary">{data.bPlus}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">University Entry</span>
                  <span className="font-bold text-accent">{data.universityEntry}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Academics
