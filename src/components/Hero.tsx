import { ChevronRight, Play, ArrowRight, LogIn, UserPlus, X, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from './hooks/useInView'
import { ImageWithFallback } from './figma/ImageWithFallback'

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

interface HeroProps {
  onNavigate?: (page: string) => void
}

export function Hero({ onNavigate }: HeroProps) {
  const { ref, isInView } = useInView(0.3)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const images = [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('userEmail')
    setIsLoggedIn(!!token)
    setIsAdmin(userEmail === 'varunkanu2000@gmail.com' || userEmail === 'paras@gmail.com')

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [images.length, isLoading])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLoginClick = () => {
    if (onNavigate) {
      onNavigate('login')
    } else {
      window.location.href = '/login'
    }
  }

  const handleRegisterClick = () => {
    if (onNavigate) {
      onNavigate('register')
    } else {
      window.location.href = '/register'
    }
  }

  const handleDashboardClick = () => {
    window.location.href = '/dashboard'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    setIsAdmin(false)
    window.location.href = '/'
  }

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted/30" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-sm font-medium text-primary">🚀 #1 Business Consulting</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight">
                Transform Your{' '}
                <motion.span
                  className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                >
                  Business
                </motion.span>{' '}
                Today
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-xl text-muted-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Accelerate your growth with our proven strategies, expert team management, and comprehensive business solutions designed for success.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button
                onClick={() => scrollToSection('services')}
                className="group flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Today
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <motion.button
                onClick={() => scrollToSection('about')}
                className="group flex items-center justify-center px-8 py-4 bg-transparent border border-border hover:bg-accent/50 text-foreground rounded-xl font-medium transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Auth Overlay Buttons - Only show if not logged in */}
            {!isLoggedIn && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      Ready to get started? Join thousands of successful businesses.
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleLoginClick}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogIn className="w-4 h-4" />
                        Login Now
                      </motion.button>
                      <motion.button
                        onClick={handleRegisterClick}
                        className="flex items-center gap-2 px-4 py-2 bg-accept/50 hover:bg-accept text-foreground rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Register Now
                      </motion.button>
                    </div>
                  </div>
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-primary to-gray-900 rounded-lg flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Dashboard Button - Only show if logged in as admin */}
            {isLoggedIn && isAdmin && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      Welcome back! Access your admin dashboard.
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleDashboardClick}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Briefcase className="w-4 h-4" />
                        Go to Dashboard
                      </motion.button>
                    </div>
                  </div>
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-primary to-gray-900 rounded-lg flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div> 

          {/* Right Column - Image Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Loading State */}
              {isLoading && (
                <motion.div
                  className="aspect-[4/3] bg-muted/50 rounded-2xl flex items-center justify-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </motion.div>
              )}

              {/* Image Carousel */}
              {!isLoading && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: index === currentImageIndex ? 1 : 0,
                        scale: index === currentImageIndex ? 1 : 1.1
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`Business scene ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}