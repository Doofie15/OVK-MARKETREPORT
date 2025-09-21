import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Container,
  Grid,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, {
          name,
          surname,
          mobile_number: mobileNumber
        })
      } else {
        result = await signIn(email, password)
      }

      if (result.success) {
        onSuccess?.()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #4a6fa5 50%, #6b8cc3 75%, #8fb3d3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Logo and branding */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: 'center',
                color: 'white',
                mb: { xs: 4, md: 0 }
              }}
            >
              {/* Company Logo */}
              <Box
                sx={{
                  mb: 6,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img
                  src="/assets/logos/ovk-logo-embedded.svg"
                  alt="OVK Logo"
                  style={{
                    height: '180px',
                    width: 'auto',
                    filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.filter = 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))';
                  }}
                />
              </Box>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: '1.4rem', md: '1.8rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.02em'
                }}
              >
                Wool Market Report System
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 400,
                  mx: 'auto',
                  opacity: 0.8,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Access comprehensive wool market data, auction reports, and analytics to make informed business decisions.
              </Typography>
            </Box>
          </Grid>

          {/* Right side - Login form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  width: '100%',
                  maxWidth: 450,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#1e3c72'
                    }}
                  >
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1.1rem'
                    }}
                  >
                    {isSignUp 
                      ? 'Join the OVK Wool Market Report system'
                      : 'Sign in to access your dashboard'
                    }
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': { fontSize: '0.95rem' }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  {isSignUp && (
                    <>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        margin="normal"
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        margin="normal"
                        disabled={loading}
                        placeholder="+27123456789"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                          }
                        }}
                      />
                    </>
                  )}

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    helperText={isSignUp ? "Password must be at least 6 characters" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 4,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 16px rgba(30, 60, 114, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                        boxShadow: '0 12px 20px rgba(30, 60, 114, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      component="button"
                      type="button"
                      variant="body1"
                      onClick={() => {
                        setIsSignUp(!isSignUp)
                        setError('')
                      }}
                      disabled={loading}
                      sx={{
                        color: '#1e3c72',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        },
                        fontSize: '1rem'
                      }}
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"
                      }
                    </Link>
                  </Box>
                </form>

                {isSignUp && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '& .MuiAlert-message': { fontSize: '0.9rem' }
                    }}
                  >
                    After creating your account, you'll need to wait for admin approval before you can access the system.
                  </Alert>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </Box>
  )
}

export default LoginForm
