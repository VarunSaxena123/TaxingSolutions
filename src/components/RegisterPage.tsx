import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Building, Phone, Shield, Award, Globe, X } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { ScrollProgress } from './ScrollProgress'

// Toast Notification Component
function Toast({ message, type = 'success', onClose }) {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className={`p-4 rounded-lg shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4">
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface RegisterPageProps {
  onSwitchToLogin: () => void
  onBackToHome: () => void
}

export function RegisterPage({ onSwitchToLogin, onBackToHome }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    acceptTerms: false,
    subscribeNewsletter: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validate step 1 fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        showToast('Please fill in all required fields', 'error')
        return
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        showToast('Please enter a valid email address', 'error')
        return
      }
      
      setStep(2)
      return
    }
    
    // Validate step 2 fields
    if (!formData.password || !formData.confirmPassword) {
      showToast('Please fill in all password fields', 'error')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error')
      return
    }
    
    if (!formData.acceptTerms) {
      showToast('Please accept the terms and conditions', 'error')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Call your FastAPI backend
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          password: formData.password,
          referral_code: formData.referralCode || null
        }),
      })
  
      if (response.ok) {
        const data = await response.json()
        
        // Store the JWT token and user info
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userRole', data.role || 'user')
        
        showToast('Registration successful! Redirecting...')
        
        // Handle newsletter subscription if selected
        if (formData.subscribeNewsletter) {
          try {
            await fetch('https://taxingsolutions-backend.onrender.com/auth/newsletter/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email
              }),
            })
          } catch (error) {
            console.error('Newsletter subscription error:', error)
          }
        }
        
        // Redirect after successful registration
        setTimeout(() => {
          if (data.email === 'varunkanu2000@gmail.com' || data.email === 'paras@gmail.com') {
            window.location.href = '/dashboard'
          } else {
            window.location.href = '/'
          }
        }, 1500)
        
      } else {
        // Handle different error responses
        let errorMessage = 'Registration failed. Please try again.'
        
        try {
          const errorData = await response.json()
          console.error('Backend error details:', errorData)
          
          if (response.status === 409) {
            errorMessage = 'Email already registered'
          } else if (response.status === 422) {
            // Handle validation errors
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map(err => err.msg).join(', ')
              } else {
                errorMessage = errorData.detail
              }
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }
        
        throw new Error(errorMessage)
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      showToast(error.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ScrollProgress />
      <DarkModeToggle />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      
      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <motion.div
          className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-600 relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() > 0.5 ? '12px' : '16px',
                  height: Math.random() > 0.5 ? '12px' : '16px',
                  borderRadius: Math.random() > 0.5 ? '2px' : '50%',
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 flex items-center justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="mb-8"
              >
                <Shield className="w-16 h-16 mx-auto mb-4" />
              </motion.div>

              <motion.h2
                className="text-4xl font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Start Your Journey
              </motion.h2>

              <motion.p
                className="text-xl text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Create your account and unlock premium business solutions designed for growth.
              </motion.p>

              {/* Features */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: <Award className="w-5 h-5" />, text: "Premium Support" },
                  { icon: <Globe className="w-5 h-5" />, text: "Global Solutions" },
                  { icon: <Shield className="w-5 h-5" />, text: "Secure & Trusted" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {feature.icon}
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            {/* Back Button */}
            <motion.button
              onClick={onBackToHome}
              className="mb-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Home
            </motion.button>

            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-lg">TS</span>
                </div>
              </div>
              <h1 className="text-3xl font-medium text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Step {step} of 2 - {step === 1 ? 'Personal Information' : 'Account Details'}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="w-full bg-muted/30 rounded-full h-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: '50%' }}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Register Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Email Field */}
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
  <label htmlFor="referralCode" className="text-sm font-medium text-foreground">
    Franchise Referral Code (Optional)
  </label>
  <motion.input
    type="text"
    id="referralCode"
    name="referralCode"
    value={formData.referralCode}
    onChange={handleInputChange}
    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
    placeholder="Enter franchise referral code if you have one"
    whileFocus={{ scale: 1.02 }}
  />
</div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Phone Number (Optional)
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <motion.input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="Create a strong password (min 8 chars)"
                          required
                          minLength={8}
                          whileFocus={{ scale: 1.02 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <motion.input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="Confirm your password"
                          required
                          minLength={8}
                          whileFocus={{ scale: 1.02 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms & Newsletter */}
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary/20 mt-1"
                          required
                        />
                        <span className="text-sm text-muted-foreground">
                          I agree to the{' '}
                          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                            Privacy Policy
                          </a> *
                        </span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary/20"
                        />
                        <span className="text-sm text-muted-foreground">
                          Subscribe to our newsletter for updates and tips
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex space-x-4">
                {step === 2 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-muted text-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : step === 1 ? (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Login Link */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <motion.button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in here
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
