import { useState } from 'react'

const initialFormData = {
  studentName: '',
  kcpeIndex: '',
  kcpeMarks: '',
  parentName: '',
  parentEmail: '',
  parentPhone: ''
}

const Admission = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        body: new FormData(form)
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit your application.')
      }

      setStatusMessage(result.message || 'Application submitted successfully.')
      form.reset()
      setFormData(initialFormData)
    } catch (error) {
      setStatusMessage(error.message || 'Unable to submit your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const steps = [
    { number: 1, title: 'Apply Online', desc: 'Fill out the admission form and upload required documents (birth certificate, KCPE results, passport photo).' },
    { number: 2, title: 'Review Process', desc: 'School administration reviews your application and supporting documents.' },
    { number: 3, title: 'Admission Approval', desc: 'If approved, you\'ll receive an admission number and be moved to the registration module.' },
    { number: 4, title: 'Registration', desc: 'Complete student registration with class assignment and full profile setup.' }
  ]

  return (
    <section id="admission" className="section-container bg-transparent">
      <div className="section-header">
        <h2 className="section-title">Admission Process</h2>
        <p className="section-subtitle">Join our community of learners</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Application</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">Student Full Name</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="kcpeIndex" className="block text-sm font-medium text-gray-700 mb-2">KCPE Index Number</label>
              <input
                type="text"
                id="kcpeIndex"
                name="kcpeIndex"
                value={formData.kcpeIndex}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="kcpeMarks" className="block text-sm font-medium text-gray-700 mb-2">KCPE Marks</label>
              <input
                type="number"
                id="kcpeMarks"
                name="kcpeMarks"
                value={formData.kcpeMarks}
                onChange={handleChange}
                min="0"
                max="500"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name</label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
              <input
                type="tel"
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            {[
              { name: 'birthCertificate', label: 'Birth Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
              { name: 'kcpeResults', label: 'KCPE Results', accept: '.pdf,.jpg,.jpeg,.png' },
              { name: 'passportPhoto', label: 'Passport Photo', accept: '.jpg,.jpeg,.png' }
            ].map((documentField) => (
              <div key={documentField.name}>
                <label htmlFor={documentField.name} className="block text-sm font-medium text-gray-700 mb-2">
                  {documentField.label}
                </label>
                <input
                  type="file"
                  id={documentField.name}
                  name={documentField.name}
                  accept={documentField.accept}
                  required
                  className="w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium"
                />
              </div>
            ))}
            {statusMessage && (
              <p role="status" aria-live="polite" className="text-sm text-gray-700">
                {statusMessage}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Admission
