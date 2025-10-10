import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Users, TrendingUp, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface LoginPageProps {
  onSwitchToRegister: () => void
  onBackToHome: () => void
}

export function LoginPage({ onSwitchToRegister, onBackToHome }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    referralCode: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          referral_code: formData.referralCode || null
        }),
      })
  
      const responseData = await response.json()
      
      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('token', responseData.access_token)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userRole', responseData.role || 'user')
        
        showToast('Login successful! Redirecting...')
        
        setTimeout(() => {
          // Redirect based on user role
          if (responseData.role === 'super_admin') {
            window.location.href = '/super-dashboard'
          } else if (responseData.role === 'franchise') {
            window.location.href = '/franchise-dashboard'
          }else {
            window.location.href = '/'
          }
        }, 1500)
        
      } else {
        // Handle specific error cases
        let errorMessage = 'Login failed. Please try again.'
        
        if (response.status === 401) {
          errorMessage = responseData.detail || 'Invalid email or password'
        } else if (response.status === 404) {
          errorMessage = 'User not found'
        } else if (response.status === 422) {
          errorMessage = 'Invalid input data'
        }
        
        throw new Error(errorMessage)
      }
      
    } catch (error) {
      console.error('Login error:', error)
      showToast(error.message || 'Login failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
              <h1 className="text-3xl font-medium text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
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
                    placeholder="Enter your email"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
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
                    placeholder="Enter your password"
                    required
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
              

              <div className="space-y-2">
      <label htmlFor="referralCode" className="text-sm font-medium text-foreground">
        Franchise Referral Code(Mandatory)
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <motion.button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot password?
                </motion.button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
<div className="grid grid-cols-1 gap-3">
  <motion.button
    type="button"
    className="flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => {
      // Handle Google login
      window.location.href = 'http://localhost:8001/auth/google';
    }}
  >
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    Sign in with Google
  </motion.button>
</div>
            </motion.form>

            {/* Register Link */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <motion.button
                  onClick={onSwitchToRegister}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up here
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Hero Section */}
        <motion.div
          className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-600 relative overflow-hidden"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 45, 90, 135, 180],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4" />
              </motion.div>

              <motion.h2
                className="text-4xl font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Welcome to Taxing Solutions
              </motion.h2>

              <motion.p
                className="text-xl text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Join thousands of businesses that trust us to accelerate their growth and success.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-medium">500+</div>
                  <div className="text-sm text-white/70">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-medium">98%</div>
                  <div className="text-sm text-white/70">Success Rate</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}