import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, Building, User, MessageSquare, ArrowRight, Send, CheckCircle } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { ScrollProgress } from './ScrollProgress'
import { ParticleBackground } from './ParticleBackground'

interface EnquiryPageProps {
  onBackToHome: () => void
}

export function EnquiryPage({ onBackToHome }: EnquiryPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    serviceType: '',
    budget: '',
    timeline: '',
    message: '',
    howDidYouHear: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Handle successful submission here
    console.log('Enquiry submitted:', formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <DarkModeToggle />
        <ScrollProgress />
        
        <motion.div
          className="max-w-md mx-auto text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            className="text-2xl font-medium text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Thank You!
          </motion.h2>
          
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your enquiry has been submitted successfully. We'll get back to you within 24 hours.
          </motion.p>
          
          <motion.button
            onClick={onBackToHome}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <ScrollProgress />
      <DarkModeToggle />
      
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={onBackToHome}
            className="mb-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </motion.button>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <Send className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your business? Fill out this form and we'll get back to you with a personalized proposal.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <motion.input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="John"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name *
                    </label>
                    <motion.input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="Doe"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <motion.input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="john@example.com"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <motion.input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="+1 (555) 123-4567"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-6">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <motion.input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="Your Company"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium text-foreground">
                      Job Title
                    </label>
                    <motion.input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="CEO, CTO, Manager, etc."
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-6">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="serviceType" className="text-sm font-medium text-foreground">
                      Service Type *
                    </label>
                    <motion.select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Select a service</option>
                      <option value="business-strategy">Business Strategy</option>
                      <option value="team-management">Team Management</option>
                      <option value="market-analysis">Market Analysis</option>
                      <option value="growth-solutions">Growth Solutions</option>
                      <option value="financial-consulting">Financial Consulting</option>
                      <option value="digital-transformation">Digital Transformation</option>
                      <option value="custom-solution">Custom Solution</option>
                    </motion.select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium text-foreground">
                      Budget Range
                    </label>
                    <motion.select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                    </motion.select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="timeline" className="text-sm font-medium text-foreground">
                      Timeline
                    </label>
                    <motion.select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-12-months">6-12 months</option>
                      <option value="flexible">Flexible</option>
                    </motion.select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="howDidYouHear" className="text-sm font-medium text-foreground">
                      How did you hear about us?
                    </label>
                    <motion.select
                      id="howDidYouHear"
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Select source</option>
                      <option value="google">Google Search</option>
                      <option value="social-media">Social Media</option>
                      <option value="referral">Referral</option>
                      <option value="event">Event/Conference</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </motion.select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Project Details & Requirements *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                    <motion.textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      placeholder="Tell us about your project, goals, challenges, and what you're looking to achieve..."
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Submitting...' : 'Submit Enquiry'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}