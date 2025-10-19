
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Settings, BarChart3, Shield, 
  UserCheck, UserX, Mail, Bell, 
  LogOut, ChevronDown, Home, Briefcase,
  Calendar, FileText, PieChart, Save,
  Download, Building, UserCog, Plus, X
} from 'lucide-react'

export function SuperDashboard() {
  const [user, setUser] = useState(null)
  const [franchises, setFranchises] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedFranchise, setSelectedFranchise] = useState(null)
  const [franchiseUsers, setFranchiseUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [showCreateFranchise, setShowCreateFranchise] = useState(false)
  const [newFranchiseEmail, setNewFranchiseEmail] = useState('')
  const [newFranchiseName, setNewFranchiseName] = useState('')
  const [selectedUserEmail, setSelectedUserEmail] = useState('')
  const [isCreatingFranchise, setIsCreatingFranchise] = useState(false)
  const [createMessage, setCreateMessage] = useState('')

  const getAuthToken = () => {
    return localStorage.getItem('token')
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = getAuthToken()
        const userEmail = localStorage.getItem('userEmail')
        
        if (!token) {
          console.error('No token found')
          handleLogout()
          return
        }
        
        // Check if user is super admin
        const isSuperAdmin = userEmail === 'varunkanu2000@gmail.com' || userEmail === 'paras@gmail.com'
        if (!isSuperAdmin) {
          console.error('Access denied: Super admin privileges required')
          handleLogout()
          return
        }
        
        // Fetch current user details
        const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const usersData = await response.json()
          const currentUser = usersData.find(u => u.email === userEmail)
          if (currentUser) {
            setUser(currentUser)
          }
        }
        
        // Fetch all franchises and users
        await Promise.all([fetchAllFranchises(), fetchAllUsers()])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const fetchAllFranchises = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/admin/franchises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const franchisesData = await response.json()
        setFranchises(franchisesData)
      }
    } catch (error) {
      console.error('Error fetching franchises:', error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const usersData = await response.json()
        setAllUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchFranchiseUsers = async (franchiseCode) => {
    try {
      const token = getAuthToken()
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const allUsers = await response.json()
        // Filter users by franchise code - fixed filtering logic
        const users = allUsers.filter(user => user.referral_code === franchiseCode)
        setFranchiseUsers(users)
      }
    } catch (error) {
      console.error('Error fetching franchise users:', error)
    }
  }

  const handleFranchiseSelect = (franchise) => {
    setSelectedFranchise(franchise)
    fetchFranchiseUsers(franchise.referral_code)
  }

  const handleExportUsers = async () => {
    setIsExporting(true)
    try {
      const token = getAuthToken()
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/admin/export/users', {
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

  const handleCreateFranchise = async () => {
    setIsCreatingFranchise(true)
    setCreateMessage('')
    
    try {
      const token = getAuthToken()
      const email = selectedUserEmail || newFranchiseEmail
      
      if (!email) {
        setCreateMessage('Please enter an email address')
        return
      }
      
      const response = await fetch('https://taxingsolutions-backend.onrender.com/auth/admin/franchises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          franchise_name: newFranchiseName || undefined
        })
      })
      
      if (response.ok) {
        setCreateMessage('Franchise created successfully!')
        setNewFranchiseEmail('')
        setNewFranchiseName('')
        setSelectedUserEmail('')
        setShowCreateFranchise(false)
        
        // Refresh franchises list
        await fetchAllFranchises()
      } else {
        const errorData = await response.json()
        setCreateMessage(errorData.detail || 'Failed to create franchise')
      }
    } catch (error) {
      console.error('Error creating franchise:', error)
      setCreateMessage('Error creating franchise. Please try again.')
    } finally {
      setIsCreatingFranchise(false)
      setTimeout(() => setCreateMessage(''), 3000)
    }
  }

  const handleDeleteFranchise = async (franchiseId) => {
    if (!window.confirm('Are you sure you want to delete this franchise?')) {
      return
    }
    
    try {
      const token = getAuthToken()
      const response = await fetch(`https://taxingsolutions-backend.onrender.com/auth/admin/franchises/${franchiseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        // Refresh franchises list
        await fetchAllFranchises()
        if (selectedFranchise && selectedFranchise.id === franchiseId) {
          setSelectedFranchise(null)
          setFranchiseUsers([])
        }
      } else {
        console.error('Failed to delete franchise')
      }
    } catch (error) {
      console.error('Error deleting franchise:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
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
                  <p className="text-xs text-gray-500">Super Admin</p>
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
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Franchise Management</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select a franchise to view their users and analytics
              </p>
              
              <button
                onClick={() => setShowCreateFranchise(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center mb-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Franchise
              </button>
              
              <button
                onClick={handleExportUsers}
                disabled={isExporting}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export All Users
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Franchise List</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {franchises.map((franchise) => (
                  <div
                    key={franchise.id}
                    className={`p-3 rounded-md transition-colors ${
                      selectedFranchise?.id === franchise.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => handleFranchiseSelect(franchise)}
                        className="text-left flex-1"
                      >
                        <div className="font-medium">{franchise.franchise_name}</div>
                        <div className="text-xs text-gray-500">{franchise.email}</div>
                        <div className="text-xs text-gray-400">Code: {franchise.referral_code}</div>
                      </button>
                      <button
                        onClick={() => handleDeleteFranchise(franchise.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {franchises.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No franchises found</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {createMessage && (
              <div className={`mb-4 p-3 rounded-md ${
                createMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {createMessage}
              </div>
            )}

            {showCreateFranchise ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Franchise</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Select Existing User</h3>
                    <select
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select a user</option>
                      {allUsers
                        .filter(user => user.role !== 'super_admin' && user.role !== 'franchise')
                        .map(user => (
                          <option key={user.id} value={user.email}>
                            {user.first_name} {user.last_name} ({user.email})
                          </option>
                        ))
                      }
                    </select>
                    <p className="text-sm text-gray-500 mt-2">Or enter email manually below</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Create New Franchise</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={newFranchiseEmail}
                          onChange={(e) => setNewFranchiseEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Franchise Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={newFranchiseName}
                          onChange={(e) => setNewFranchiseName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter franchise name"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowCreateFranchise(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateFranchise}
                      disabled={isCreatingFranchise || (!selectedUserEmail && !newFranchiseEmail)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {isCreatingFranchise ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Franchise
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : selectedFranchise ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Franchise Header */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedFranchise.franchise_name}</h2>
                      <p className="text-gray-600">
                        Referral Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedFranchise.referral_code}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{franchiseUsers.length}</p>
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
                          {franchiseUsers.filter(user => {
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
                          {franchiseUsers.length > 0 ? '12%' : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Users</h3>
                    <span className="text-sm text-gray-500">{franchiseUsers.length} users found</span>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {franchiseUsers.map((user) => (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {franchiseUsers.length === 0 && (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              No users found for this franchise
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <UserCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Super Admin Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Select a franchise from the sidebar to view their users and analytics.
                </p>
                <p className="text-sm text-gray-500">
                  You can also create new franchises or export all user data using the buttons in the sidebar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
