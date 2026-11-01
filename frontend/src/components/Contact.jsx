import { useState } from 'react'

const Contact = () => {
  const [statusMessage, setStatusMessage] = useState('')
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactSubject: '',
    contactMessage: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(formData.contactSubject || 'Website enquiry')
    const body = encodeURIComponent(
      `Name: ${formData.contactName}\nEmail: ${formData.contactEmail}\n\n${formData.contactMessage}`
    )
    setStatusMessage('Your email application should open with this message ready to send.')
    window.location.href = `mailto:info@kitoohighschool.ac.ke?subject=${subject}&body=${body}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const contactInfo = [
    { icon: 'fas fa-map-marker-alt', title: 'Address', details: ['P.O. Box 12345, Kitoo, Kenya'] },
    { icon: 'fas fa-phone', title: 'Phone', details: ['+254 114417371', '+254 794113987'] },
    { icon: 'fas fa-envelope', title: 'Email', details: ['info@kitoohighschool.ac.ke', 'admissions@kitoohighschool.ac.ke'] },
    { icon: 'fas fa-clock', title: 'Office Hours', details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 1:00 PM'] }
  ]

  return (
    <section id="contact" className="section-container bg-white">
      <div className="section-header">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Get in touch with us</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center">
                <i className={info.icon}></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                id="contactSubject"
                name="contactSubject"
                value={formData.contactSubject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                id="contactMessage"
                name="contactMessage"
                value={formData.contactMessage}
                onChange={handleChange}
                rows="5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              ></textarea>
            </div>
            {statusMessage && (
              <p role="status" aria-live="polite" className="text-sm text-gray-700">
                {statusMessage}
              </p>
            )}
            <button type="submit" className="w-full btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
