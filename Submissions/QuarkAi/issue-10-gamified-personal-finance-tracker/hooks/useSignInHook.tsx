import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as React from 'react'

// Custom hook for signin functionality with validation
export const useSignInHook = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [validationErrors, setValidationErrors] = React.useState<{
    email?: string
    password?: string
  }>({})

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    const newValidationErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!emailAddress.trim()) {
      newValidationErrors.email = 'Email is required'
    } else if (!validateEmail(emailAddress)) {
      newValidationErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password.trim()) {
      newValidationErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newValidationErrors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(newValidationErrors)
    return Object.keys(newValidationErrors).length === 0
  }

  // Clear validation errors when user types
  const handleEmailChange = (email: string) => {
    setEmailAddress(email)
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }))
    }
    if (error) setError('')
  }

  const handlePasswordChange = (password: string) => {
    setPassword(password)
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }))
    }
    if (error) setError('')
  }

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Validate form first
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      })

      // If sign-in process is complete, set the created session as active
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // Handle incomplete sign-in (might need 2FA, etc.)
        // console.error('Sign-in incomplete:', signInAttempt)
        setError('Sign-in incomplete. Please try again or contact support.')
      }
    } catch (err: any) {
      // console.error('Sign in error:', err)

      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0]
        
        switch (clerkError.code) {
          case 'form_identifier_not_found':
            setError('No account found with this email address. Please check your email or sign up.')
            break
          case 'form_password_incorrect':
            setError('Incorrect password. Please try again.')
            break
          case 'form_identifier_exists':
            setError('Account exists but password is incorrect.')
            break
          case 'too_many_requests':
            setError('Too many failed attempts. Please wait a moment and try again.')
            break
          case 'session_exists':
            setError('You are already signed in.')
            break
          default:
            setError(clerkError.message || 'Invalid email or password. Please try again.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setEmailAddress('')
    setPassword('')
    setError('')
    setValidationErrors({})
  }

  return {
    emailAddress,
    setEmailAddress: handleEmailChange,
    password,
    setPassword: handlePasswordChange,
    loading,
    error,
    validationErrors,
    onSignInPress,
    resetForm,
    isFormValid: !validationErrors.email && !validationErrors.password && emailAddress.trim() && password.trim(),
  }
}
