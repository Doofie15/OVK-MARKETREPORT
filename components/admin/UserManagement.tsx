import React, { useState, useEffect } from 'react'
import { SupabaseAuctionDataService } from '../../data/supabase-service'
import type { Database } from '../../lib/supabase'
import { UserType } from '../../types'

type User = Database['public']['Tables']['users']['Row'] & { 
  is_empty?: boolean
  user_types?: UserType
}
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

interface UserManagementProps {
  currentUser?: User
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deletePasswordError, setDeletePasswordError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile_number: '',
    password: '',
    user_type_id: 'f46ab313-ec4d-4846-a255-f4a8085f271f' // Default to viewer
  })
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [viewUserModal, setViewUserModal] = useState<User | null>(null)
  const [approvalModal, setApprovalModal] = useState<User | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [userTypes, setUserTypes] = useState<UserType[]>([])

  // Load users and user types on component mount
  useEffect(() => {
    loadUsers()
    loadUserTypes()
  }, [])

  const loadUserTypes = async () => {
    try {
      const result = await SupabaseAuctionDataService.getUserTypes()
      if (result.success) {
        setUserTypes(result.data)
      }
    } catch (error) {
      console.error('Error loading user types:', error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null)
    }
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

  // Filter users based on search term and active tab
  useEffect(() => {
    let filtered = users

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = users.filter(user => user.approval_status === 'pending')
    } else if (activeTab === 'approved') {
      filtered = users.filter(user => user.approval_status === 'approved')
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_types?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, activeTab])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await SupabaseAuctionDataService.getUsers()
      
      if (result.success) {
        setUsers(result.data || [])
      } else {
        setError(result.error || 'Failed to load users')
      }
    } catch (err) {
      setError('Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        surname: user.surname,
        email: user.email,
        mobile_number: user.mobile_number || '',
        user_type_id: user.user_type_id
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        surname: '',
        email: '',
        mobile_number: '',
        password: '',
        user_type_id: 'f46ab313-ec4d-4846-a255-f4a8085f271f'
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setFormData({
      name: '',
      surname: '',
      email: '',
      mobile_number: '',
      password: '',
      status: 'viewer'
    })
  }

  const handleSubmit = async () => {
    try {
      setError(null)

      if (!currentUser) {
        setError('You must be logged in to manage users')
        return
      }

      if (editingUser) {
        // Update existing user
        const updateData: UserUpdate = {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          mobile_number: formData.mobile_number || null,
          user_type_id: formData.user_type_id,
          updated_at: new Date().toISOString()
        }

        const result = await SupabaseAuctionDataService.updateUser(editingUser.id, updateData)
        
        if (result.success) {
          await loadUsers()
          handleCloseDialog()
          setSuccessMessage('User updated successfully!')
          setTimeout(() => setSuccessMessage(null), 3000)
        } else {
          setError(result.error || 'Failed to update user')
        }
      } else {
        // Create new user with Supabase Auth
        const password = formData.password || 'TempPassword123!' // Use provided password or default
        const result = await SupabaseAuctionDataService.signUp(
          formData.email,
          password,
          {
            name: formData.name,
            surname: formData.surname,
            mobile_number: formData.mobile_number || undefined
          }
        )
        
        if (result.success && result.data.user) {
          // Update the user's status in our users table
          const updateResult = await SupabaseAuctionDataService.updateUser(result.data.user.id, {
            user_type_id: formData.user_type_id,
            updated_at: new Date().toISOString()
          })
          
          if (updateResult.success) {
            await loadUsers()
            handleCloseDialog()
            setSuccessMessage('User created successfully!')
            setTimeout(() => setSuccessMessage(null), 3000)
            // TODO: Send password reset email to the new user
          } else {
            setError('User created but failed to set role. Please update manually.')
          }
        } else {
          setError(result.error || 'Failed to create user')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error managing user:', err)
    }
  }

  const handleDeleteUserClick = (userId: string, userName: string) => {
    setDeleteConfirm(userId)
    setDeletePassword('')
    setDeletePasswordError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    // Validate password
    if (!deletePassword.trim()) {
      setDeletePasswordError('Password is required')
      return
    }

    // Check password (you can change this to match your admin password)
    if (deletePassword !== 'admin123') {
      setDeletePasswordError('Incorrect password')
      return
    }

    try {
      setError(null)
      const result = await SupabaseAuctionDataService.deleteUser(deleteConfirm)
      
      if (result.success) {
        setSelectedUsers(selectedUsers.filter(id => id !== deleteConfirm))
        await loadUsers()
        setDeleteConfirm(null)
        setDeletePassword('')
        setDeletePasswordError(null)
      } else {
        setError(result.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user')
      console.error('Error deleting user:', err)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
    setDeletePassword('')
    setDeletePasswordError(null)
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      setError(null)
      const newUserTypeId = user.user_types?.name === 'viewer' ? '25abd8f6-3d39-4db2-88a0-6f5961121791' : 'f46ab313-ec4d-4846-a255-f4a8085f271f'
      
      const result = await SupabaseAuctionDataService.updateUser(user.id, {
        user_type_id: newUserTypeId,
        updated_at: new Date().toISOString()
      })
      
      if (result.success) {
        await loadUsers()
      } else {
        setError(result.error || 'Failed to update user status')
      }
    } catch (err) {
      setError('Failed to update user status')
      console.error('Error updating user status:', err)
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'admin':
        return 'bg-yellow-100 text-yellow-800'
      case 'editor':
        return 'bg-blue-100 text-blue-800'
      case 'viewer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      case 'editor':
        return 'Editor'
      case 'viewer':
        return 'Viewer'
      default:
        return status
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getApprovalStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const canManageUsers = currentUser?.user_types?.name === 'super_admin' || currentUser?.user_types?.name === 'admin'
  const canDeleteUsers = currentUser?.user_types?.name === 'super_admin'

  // Ensure minimum 10 rows in table
  const getTableRows = () => {
    const minRows = 10
    if (filteredUsers.length < minRows) {
      const emptyRows: User[] = Array.from({ length: minRows - filteredUsers.length }, (_, index) => ({
        id: `empty-${filteredUsers.length + index}`,
        name: '',
        surname: '',
        email: '',
        mobile_number: '',
        status: 'viewer' as const,
        approval_status: 'pending' as const,
        approved_by: null,
        approved_at: null,
        rejection_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: currentUser?.id || '',
        is_empty: true
      }))
      return [...filteredUsers, ...emptyRows]
    }
    return filteredUsers
  }

  const handleViewUser = (user: User) => {
    setViewUserModal(user)
  }

  const handleCloseViewModal = () => {
    setViewUserModal(null)
  }

  const handleApproveUser = async (user: User) => {
    if (!currentUser) return

    try {
      setError(null)
      const result = await SupabaseAuctionDataService.approveUser(user.id, currentUser.id)
      
      if (result.success) {
        await loadUsers()
        setApprovalModal(null)
        setSuccessMessage('User approved successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(result.error || 'Failed to approve user')
      }
    } catch (err) {
      setError('Failed to approve user')
      console.error('Error approving user:', err)
    }
  }

  const handleRejectUser = async (user: User) => {
    if (!currentUser) return

    try {
      setError(null)
      const result = await SupabaseAuctionDataService.rejectUser(user.id, currentUser.id, rejectionReason)
      
      if (result.success) {
        await loadUsers()
        setApprovalModal(null)
        setRejectionReason('')
      } else {
        setError(result.error || 'Failed to reject user')
      }
    } catch (err) {
      setError('Failed to reject user')
      console.error('Error rejecting user:', err)
    }
  }

  const handleOpenApprovalModal = (user: User) => {
    setApprovalModal(user)
    setRejectionReason('')
  }

  const handleCloseApprovalModal = () => {
    setApprovalModal(null)
    setRejectionReason('')
  }

  const handleBlockUser = async (user: User) => {
    try {
      setError(null)
      const newUserTypeId = user.user_types?.name === 'viewer' ? '25abd8f6-3d39-4db2-88a0-6f5961121791' : 'f46ab313-ec4d-4846-a255-f4a8085f271f'
      const action = user.user_types?.name === 'viewer' ? 'unblock' : 'block'
      
      if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
        return
      }
      
      const result = await SupabaseAuctionDataService.updateUser(user.id, {
        user_type_id: newUserTypeId,
        updated_at: new Date().toISOString()
      })
      
      if (result.success) {
        await loadUsers()
      } else {
        setError(result.error || `Failed to ${action} user`)
      }
    } catch (err) {
        setError(`Failed to ${user.user_types?.name === 'viewer' ? 'unblock' : 'block'} user`)
      console.error('Error updating user status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage admin users, roles, and access permissions</p>
        </div>
        {canManageUsers && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleOpenDialog()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + Create User
            </button>
            {activeTab === 'pending' && users.filter(u => u.approval_status === 'pending').length > 0 && (
              <button
                onClick={() => {
                  // Approve all pending users
                  const pendingUsers = users.filter(u => u.approval_status === 'pending')
                  if (window.confirm(`Approve all ${pendingUsers.length} pending users?`)) {
                    pendingUsers.forEach(user => {
                      if (currentUser) {
                        handleApproveUser(user)
                      }
                    })
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve All Pending
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-800">Total Users</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {users.filter(u => u.approval_status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-800">Pending Approval</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.approval_status === 'approved').length}
          </div>
          <div className="text-sm text-green-800">Approved</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === 'super_admin').length}
          </div>
          <div className="text-sm text-red-800">Super Admins</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.status === 'admin').length}
          </div>
          <div className="text-sm text-purple-800">Admins</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval ({users.filter(u => u.approval_status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved ({users.filter(u => u.approval_status === 'approved').length})
            </button>
          </nav>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Selection Info */}
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
            )}
            <span className="text-sm text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating a new user.'}
            </p>
            {!searchTerm && canManageUsers && (
              <div className="mt-6">
                <button
                  onClick={() => handleOpenDialog()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  + Add New User
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MOBILE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    APPROVAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CREATED
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getTableRows().map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.is_empty && (
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.is_empty ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name} {user.surname}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-10"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!user.is_empty ? user.email : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!user.is_empty ? (user.mobile_number || <span className="text-gray-400">Not provided</span>) : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.is_empty ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.user_types?.name || 'viewer')}`}>
                          {getStatusLabel(user.user_types?.name || 'viewer')}
                        </span>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.is_empty ? (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalStatusColor(user.approval_status)}`}>
                            {getApprovalStatusLabel(user.approval_status)}
                          </span>
                          {user.approval_status === 'pending' && canManageUsers && (
                            <button
                              onClick={() => handleApproveUser(user)}
                              className="inline-flex items-center px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title="Quick Approve"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.is_empty ? (
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={user.user_types?.name !== 'viewer'}
                            onChange={() => handleToggleUserStatus(user)}
                            disabled={!canManageUsers || user.id === currentUser?.id}
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2 text-sm text-gray-900">
                            {user.user_types?.name !== 'viewer' ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {!user.is_empty ? new Date(user.created_at).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!user.is_empty ? (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDropdownOpen(dropdownOpen === user.id ? null : user.id)
                            }}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          
                          {dropdownOpen === user.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleViewUser(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Details
                                </button>
                                
                              {canManageUsers && user.id !== currentUser?.id && (
                                <button
                                  onClick={() => {
                                    handleOpenDialog(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit User
                                </button>
                              )}
                              
                              {user.approval_status === 'pending' && canManageUsers && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleApproveUser(user)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve User
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleOpenApprovalModal(user)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject User
                                  </button>
                                </>
                              )}
                                
                                {user.id !== currentUser?.id && (
                                  <button
                                    onClick={() => {
                                      handleBlockUser(user)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                    </svg>
                                    {user.user_types?.name === 'viewer' ? 'Unblock User' : 'Block User'}
                                  </button>
                                )}
                                
                                {canDeleteUsers && user.id !== currentUser?.id && (
                                  <button
                                    onClick={() => {
                                      handleDeleteUserClick(user.id, `${user.name} ${user.surname}`)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete User
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <div className="space-y-4">
                {!editingUser && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">New User Setup</p>
                        <p>The user will be created with a temporary password and will need to reset it on first login.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Leave empty for auto-generated password"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      If left empty, a temporary password will be generated
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    type="text"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    placeholder="+27123456789"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.user_type_id}
                    onChange={(e) => setFormData({ ...formData, user_type_id: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {userTypes.map(userType => (
                      <option key={userType.id} value={userType.id}>
                        {userType.name} - {userType.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.surname || !formData.email || (!editingUser && formData.password && formData.password.length < 6)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter password to confirm:
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin password"
                />
                {deletePasswordError && (
                  <p className="mt-1 text-sm text-red-600">{deletePasswordError}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {viewUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-0 border-0 w-full max-w-2xl shadow-2xl rounded-lg bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {viewUserModal.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {viewUserModal.name} {viewUserModal.surname}
                  </h3>
                  <p className="text-gray-600">{viewUserModal.email}</p>
                </div>
              </div>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{viewUserModal.name} {viewUserModal.surname}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{viewUserModal.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="font-medium text-gray-900">
                          {viewUserModal.mobile_number || <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Account Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewUserModal.status)}`}>
                          {getStatusLabel(viewUserModal.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${viewUserModal.status !== 'viewer' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className="font-medium text-gray-900">
                            {viewUserModal.status !== 'viewer' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium text-gray-900">
                          {new Date(viewUserModal.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {viewUserModal.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Approval Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalStatusColor(viewUserModal.approval_status)}`}>
                          {getApprovalStatusLabel(viewUserModal.approval_status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Role Permissions</h5>
                <div className="text-sm text-gray-600">
                  {viewUserModal.status === 'super_admin' && (
                    <p>Full system access including user management, system settings, and all administrative functions.</p>
                  )}
                  {viewUserModal.status === 'admin' && (
                    <p>Administrative access to manage auctions, seasons, and reports. Can create and edit content.</p>
                  )}
                  {viewUserModal.status === 'editor' && (
                    <p>Can create and edit auction reports and market data. Limited administrative access.</p>
                  )}
                  {viewUserModal.status === 'viewer' && (
                    <p>Read-only access to view reports and data. Cannot create or modify content.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(viewUserModal.updated_at).toLocaleDateString()}
              </div>
              <div className="flex space-x-3">
                {canManageUsers && viewUserModal.id !== currentUser?.id && (
                  <button
                    onClick={() => {
                      handleOpenDialog(viewUserModal)
                      handleCloseViewModal()
                    }}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Edit User
                  </button>
                )}
                <button
                  onClick={handleCloseViewModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {approvalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject User</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject <strong>{approvalModal.name} {approvalModal.surname}</strong>? 
                They will not be able to access the admin panel.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Optional):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseApprovalModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectUser(approvalModal)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Reject User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement