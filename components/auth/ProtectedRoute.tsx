import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import LoginForm from './LoginForm'
import { Box, CircularProgress, Typography } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // TODO: Add role-based access control when user roles are implemented
  // For now, allow all authenticated users
  return <>{children}</>
}

export default ProtectedRoute
