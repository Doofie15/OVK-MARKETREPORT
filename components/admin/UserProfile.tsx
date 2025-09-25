import React, { useState, useEffect } from 'react';
import { supabase as supabaseClient } from '../../lib/supabase';

interface UserProfileData {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobile_number: string;
  created_at: string;
  updated_at: string;
  user_type_name?: string;
  approval_status: string;
}

interface UserProfileProps {
  onNavigate?: (page: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile_number: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUserProfile();
    // Scroll to top when component mounts to prevent jumping
    window.scrollTo(0, 0);
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading user profile...');

      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError) {
        throw new Error('Authentication error: ' + authError.message);
      }

      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      // Get user profile data from users table
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select(`
          *,
          user_types (
            name
          )
        `)
        .eq('id', authUser.id)
        .single();

      if (userError) {
        throw new Error('Error loading profile: ' + userError.message);
      }

      if (userData) {
        const profileData: UserProfileData = {
          ...userData,
          user_type_name: userData.user_types?.name || 'N/A'
        };
        
        setUser(profileData);
        setFormData({
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          mobile_number: userData.mobile_number || ''
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Surname validation
    if (!formData.surname.trim()) {
      errors.surname = 'Surname is required';
    } else if (formData.surname.trim().length < 2) {
      errors.surname = 'Surname must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Mobile number validation (optional but must be valid if provided)
    if (formData.mobile_number.trim()) {
      const phoneRegex = /^[+]?[(]?[\d\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(formData.mobile_number)) {
        errors.mobile_number = 'Please enter a valid mobile number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      
      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      // Update user profile in database
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          mobile_number: formData.mobile_number.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id);

      if (updateError) {
        throw new Error('Error updating profile: ' + updateError.message);
      }

      // Update auth email if it changed
      if (formData.email !== user?.email) {
        const { error: emailError } = await supabaseClient.auth.updateUser({
          email: formData.email
        });

        if (emailError) {
          // Don't throw error for email update failure, just warn
          console.warn('Email update in auth failed:', emailError);
          setSuccess('Profile updated successfully. Email change requires verification.');
        } else {
          setSuccess('Profile updated successfully!');
        }
      } else {
        setSuccess('Profile updated successfully!');
      }

      // Reload profile data
      await loadUserProfile();
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        mobile_number: user.mobile_number || ''
      });
    }
    setValidationErrors({});
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-800 font-medium">Profile Not Found</h3>
        </div>
        <p className="text-red-700 mt-2">Unable to load your profile information. Please try again or contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.approval_status)}`}>
              {user.approval_status?.charAt(0).toUpperCase() + user.approval_status?.slice(1)}
            </span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{user.name || 'Not provided'}</p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.surname ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {validationErrors.surname && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.surname}</p>
                )}
              </div>
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{user.surname || 'Not provided'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Changing your email will require verification
                </p>
              </div>
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{user.email || 'Not provided'}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.mobile_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your mobile number"
                />
                {validationErrors.mobile_number && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.mobile_number}</p>
                )}
              </div>
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{user.mobile_number || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{user.user_type_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(user.approval_status)}`}>
              {user.approval_status?.charAt(0).toUpperCase() + user.approval_status?.slice(1)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{formatDate(user.created_at)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{formatDate(user.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Security & Privacy</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Password</h3>
              <p className="text-sm text-gray-600">Last changed recently</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
