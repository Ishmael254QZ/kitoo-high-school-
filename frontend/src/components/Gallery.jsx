const Gallery = () => {
  const galleryItems = [
    { title: 'Main Building', img: 'https://via.placeholder.com/400x300?text=School+Building' },
    { title: 'Library', img: 'https://via.placeholder.com/400x300?text=Library' },
    { title: 'Science Lab', img: 'https://via.placeholder.com/400x300?text=Science+Lab' },
    { title: 'Sports Field', img: 'https://via.placeholder.com/400x300?text=Sports+Field' },
    { title: 'Classroom', img: 'https://via.placeholder.com/400x300?text=Classroom' },
    { title: 'Computer Lab', img: 'https://via.placeholder.com/400x300?text=Computer+Lab' }
  ]

  return (
    <section id="gallery" className="section-container bg-gray-50">
      <div className="section-header">
        <h2 className="section-title">School Gallery</h2>
        <p className="section-subtitle">Capturing moments of excellence</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <div key={index} className="card p-0 overflow-hidden group cursor-pointer">
            <div className="relative overflow-hidden">
              <img 
                src={item.img} 
                alt={item.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <h4 className="text-white font-bold text-xl p-6">{item.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Gallery
