import { ChevronDown, Moon, Sun, LogIn, UserPlus, Send, Home, Briefcase, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NavigationDropdownProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function NavigationDropdown({ currentPage, onNavigate }: NavigationDropdownProps) {
  const [isDark, setIsDark] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    // Check if user is logged in and admin status
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('userEmail')
    setIsLoggedIn(!!token)
    setIsAdmin(userEmail === 'varunkanu2000@gmail.com' || userEmail === 'paras@gmail.com')
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setIsAdmin(false)
    window.location.href = '/'
  }

  const handleDashboardClick = () => {
    window.location.href = '/dashboard'
  }

  const baseMenuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      description: 'Back to homepage',
      action: () => onNavigate('home')
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'View all services',
      action: () => window.location.href = '/services'
    },
    {
      id: 'enquiry',
      label: 'Place Enquiry',
      icon: <Send className="w-4 h-4" />,
      description: 'Get in touch',
      action: () => window.location.href = '/enquiry'
    }
  ]

  const authMenuItems = isLoggedIn
    ? [
        ...(isAdmin ? [{
          id: 'dashboard',
          label: 'Dashboard',
          icon: <Briefcase className="w-4 h-4" />,
          description: 'Admin dashboard',
          action: handleDashboardClick
        }] : []),
        {
          id: 'logout',
          label: 'Logout',
          icon: <LogOut className="w-4 h-4" />,
          description: 'Sign out of account',
          action: handleLogout
        }
      ]
    : [
        {
          id: 'login',
          label: 'Login',
          icon: <LogIn className="w-4 h-4" />,
          description: 'Sign in to account',
          action: () => onNavigate('login')
        },
        {
          id: 'register',
          label: 'Register',
          icon: <UserPlus className="w-4 h-4" />,
          description: 'Create new account',
          action: () => onNavigate('register')
        }
      ]

  const menuItems = [...baseMenuItems, ...authMenuItems]

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-3 bg-background border border-border rounded-full shadow-lg backdrop-blur-sm hover:bg-accent/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            animate={{ rotate: isDark ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </motion.div>
        </motion.button>

        {/* Navigation Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-full shadow-lg backdrop-blur-sm hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm font-medium text-foreground">Menu</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown Menu */}
                <motion.div
                  className="absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          item.action()
                          setIsOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          currentPage === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent text-foreground'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className={`text-xs ${
                            currentPage === item.id
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        {currentPage === item.id && (
                          <motion.div
                            className="w-2 h-2 bg-primary-foreground rounded-full"
                            layoutId="activeIndicator"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Footer */}
                  <motion.div
                    className="px-4 py-3 bg-muted/30 border-t border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground text-center">
                      Taxing Solutions
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}