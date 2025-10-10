import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Home } from './components/Home'
import { Header } from './components/Header'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollProgress } from './components/ScrollProgress'
import { BackToTop } from './components/BackToTop'
import { ParticleBackground } from './components/ParticleBackground'
import { ServicesPage } from './components/ServicesPage'
import { LoginPage } from './components/LoginPage'
import { RegisterPage } from './components/RegisterPage'
import { EnquiryPage } from './components/EnquiryPage'
import { NavigationDropdown } from './components/NavigationDropdown'
import { Dashboard } from './components/Dashboard'
import { SuperDashboard } from './components/SuperDashboard'
import { FranchiseDashboard } from './components/FranchiseDashboard'
import { useState, useEffect } from 'react'

import './styles/globals.css'

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }: { children: React.ReactNode, requiredRole?: string | null }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem('token')
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')
      
      if (!token) {
        setIsAuthorized(false)
        setIsLoading(false)
        return
      }

      try {
        if (requiredRole === 'super_admin') {
          // Only specific emails can be super admin
          setIsAuthorized(userEmail === 'varunkanu2000@gmail.com' || userEmail === 'paras@gmail.com')
        } else if (requiredRole === 'franchise') {
          // Check for franchise role
          setIsAuthorized(userRole === 'franchise')
        } else if (requiredRole) {
          // Check for specific role
          setIsAuthorized(userRole === requiredRole)
        } else {
          // Any authenticated user
          setIsAuthorized(!!token)
        }
      } catch (error) {
        console.error('Error checking authorization:', error)
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthorization()
  }, [requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location])

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-background relative text-foreground">
      {/* Background Effects */}
      <ParticleBackground />

      {/* Theme Toggle & Scroll UI */}
      <ScrollProgress />
      <NavigationDropdown currentPage={currentPage} onNavigate={handleNavigate} />
      <BackToTop />

      {/* Header is shown only on Home */}
      {isHome && <Header />}

      <Routes>
        <Route path="/" element={<Home onNavigate={handleNavigate} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/franchise-dashboard" 
          element={
            <ProtectedRoute requiredRole="franchise">
              <FranchiseDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/super-dashboard" 
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <LoginPage 
              onSwitchToRegister={() => window.location.href = '/register'} 
              onBackToHome={() => window.location.href = '/'} 
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            <RegisterPage 
              onSwitchToLogin={() => window.location.href = '/login'} 
              onBackToHome={() => window.location.href = '/'} 
            />
          } 
        />
        <Route path="/enquiry" element={<EnquiryPage />} />
      </Routes>

      {/* Footer also conditionally shown */}
      {isHome && <Footer />}
    </div>
  )
}