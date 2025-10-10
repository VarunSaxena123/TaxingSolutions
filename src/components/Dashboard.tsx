import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Settings, BarChart3, Shield, 
  UserCheck, UserX, Mail, Bell, 
  LogOut, ChevronDown, Home, Briefcase,
  Calendar, FileText, PieChart, Save,
  Download, Building
} from 'lucide-react'

export function Dashboard() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole, setUserRole] = useState('user')
  const [isLoading, setIsLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editingRoles, setEditingRoles] = useState({})
  const [isSavingRoles, setIsSavingRoles] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const getAuthToken = () => {
    return localStorage.getItem('token')
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = getAuthToken()
        const userEmail = localStorage.getItem('userEmail')
        const storedRole = localStorage.getItem('userRole')
        
        if (!token) {
          console.error('No token found')
          handleLogout()
          return
        }
        
        // Check user role
        setUserRole(storedRole || 'user')
        
        // If user is super admin, redirect to super dashboard
        if (userEmail === 'varunkanu2000@gmail.com' || userEmail === 'paras@gmail.com') {
          window.location.href = '/super-dashboard'
          return
        }
        
        // Fetch current user details
        const response = await fetch('http://localhost:8001/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const currentUser = await response.json()
          setUser(currentUser)
          setFirstName(currentUser.first_name)
          setLastName(currentUser.last_name)
          
          // If user is franchise, fetch their users
          if (currentUser.role === 'franchise' && currentUser.franchise_code) {
            fetchFranchiseUsers(currentUser.franchise_code)
          } else if (storedRole === 'admin') {
            // If user is admin, fetch all users
            fetchAllUsers()
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchCurrentUser()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
        
        // Initialize editing roles state
        const rolesState = {}
        usersData.forEach(user => {
          rolesState[user.id] = user.role
        })
        setEditingRoles(rolesState)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setSaveMessage('Error fetching users. Please try again.')
    }
  }

  const fetchFranchiseUsers = async (franchiseCode) => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const allUsers = await response.json()
        // Filter users by franchise code - fixed filtering logic
        const franchiseUsers = allUsers.filter(user => user.referral_code === franchiseCode)
        setUsers(franchiseUsers)
      }
    } catch (error) {
      console.error('Error fetching franchise users:', error)
      setSaveMessage('Error fetching users. Please try again.')
    }
  }

  const handleExportUsers = async () => {
    setIsExporting(true)
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8001/admin/export/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'users_export.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting users:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!user) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const token = getAuthToken()
      if (!token) {
        setSaveMessage('Authentication failed. Please log in again.')
        return
      }

      const response = await fetch(`http://localhost:8001/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          company: user.company,
          phone: user.phone
        })
      })
      
      if (response.ok) {
        setSaveMessage('Changes saved successfully!')
        // Update local user state
        setUser({
          ...user,
          first_name: firstName,
          last_name: lastName
        })
        
        // Update users list if admin
        if (isAdmin) {
          fetchAllUsers()
        }
      } else {
        setSaveMessage('Failed to save changes. Please try again.')
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      setSaveMessage('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleRoleChange = (userId: number, newRole: string) => {
    setEditingRoles(prev => ({
      ...prev,
      [userId]: newRole
    }))
  }

  const saveUserRole = async (userId: number) => {
    setIsSavingRoles(true)
    
    try {
      const token = getAuthToken()
      if (!token) {
        setSaveMessage('Authentication failed. Please log in again.')
        return
      }

      const response = await fetch(`http://localhost:8001/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: editingRoles[userId]
        })
      })
      
      if (response.ok) {
        // Update local users state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, role: editingRoles[userId] } : u
          )
        )
        setSaveMessage('Role updated successfully!')
      } else if (response.status === 403) {
        setSaveMessage('Admin access required to modify roles')
      } else {
        setSaveMessage('Failed to update role. Please try again.')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      setSaveMessage('Error updating role. Please try again.')
    } finally {
      setIsSavingRoles(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <p className="text-gray-600 mb-4">Unable to load user information</p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              {userRole === 'franchise' && user?.franchise_code && (
                <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                  Franchise: {user.franchise_code}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-black px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'overview', name: 'Overview', icon: Home },
                ...(userRole === 'admin' || userRole === 'franchise' ? [
                  { id: 'users', name: 'User Management', icon: Users }
                ] : []),
                { id: 'settings', name: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Export button for admin/franchise */}
            {(userRole === 'admin' || userRole === 'franchise') && (
              <div className="mt-6">
                <button
                  onClick={handleExportUsers}
                  disabled={isExporting}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export Users
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {saveMessage && (
              <div className={`mb-4 p-3 rounded-md ${
                saveMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {saveMessage}
              </div>
            )}

            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user?.first_name}!</h2>
                  <p className="text-gray-600">
                    {userRole === 'franchise' 
                      ? `Here's the overview of your franchise performance.`
                      : 'Here\'s what\'s happening with your account today.'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {users.filter(user => {
                            const created = new Date(user.created_at)
                            const now = new Date()
                            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                          }).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {users.length > 0 ? '12%' : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (userRole === 'admin' || userRole === 'franchise') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600 mt-1">
                    {userRole === 'franchise' 
                      ? 'Manage users who signed up with your franchise code'
                      : 'Manage all users in the system'
                    }
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        {userRole === 'admin' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.first_name[0]}{user.last_name[0]}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.company || 'N/A'}
                          </td>
                          {userRole === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.role === 'franchise'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={userRole === 'admin' ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button 
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}