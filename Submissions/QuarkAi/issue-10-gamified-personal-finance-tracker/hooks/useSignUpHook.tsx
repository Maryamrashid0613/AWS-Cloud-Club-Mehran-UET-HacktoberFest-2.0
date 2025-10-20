import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as React from 'react'

// Custom hook for signup functionality with validation
export const useSignUpHook = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
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

    // Password validation
    const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
        const errors: string[] = []

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long')
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number')
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character (@$!%*?&)')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
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
        } else {
            const passwordValidation = validatePassword(password)
            if (!passwordValidation.isValid) {
                newValidationErrors.password = passwordValidation.errors[0] // Show first error
            }
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

    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Validate form first
        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError('')

        try {
            await signUp.create({
                emailAddress: emailAddress.trim(),
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err: any) {
            

            // Handle specific Clerk errors
            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0]
                if (clerkError.code === 'form_identifier_exists') {
                    setError('An account with this email already exists. Please sign in instead.')
                } else if (clerkError.code === 'form_password_pwned') {
                    setError('This password has been found in a data breach. Please choose a different password.')
                } else if (clerkError.code === 'form_password_validation_failed') {
                    setError('Password does not meet security requirements. Please choose a stronger password.')
                } else {
                    setError(clerkError.message || 'An error occurred during sign up')
                }
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) return

        // Validate verification code
        if (!code.trim()) {
            setError('Please enter the verification code')
            return
        }

        if (code.length !== 6) {
            setError('Verification code must be 6 digits')
            return
        }

        setLoading(true)
        setError('')

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: code.trim(),
            })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                setError('Verification incomplete. Please try again.')
            }
        } catch (err: any) {
            

            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0]
                if (clerkError.code === 'form_code_incorrect') {
                    setError('Invalid verification code. Please check and try again.')
                } else if (clerkError.code === 'verification_expired') {
                    setError('Verification code has expired. Please request a new one.')
                } else {
                    setError(clerkError.message || 'Invalid verification code')
                }
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const resendVerificationCode = async () => {
        if (!isLoaded) return

        setLoading(true)
        setError('')

        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setError('') // Clear any previous errors
            // You might want to show a success message here
        } catch (err: any) {
            
            setError('Failed to resend verification code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return {
        emailAddress,
        setEmailAddress: handleEmailChange,
        password,
        setPassword: handlePasswordChange,
        code,
        setCode,
        pendingVerification,
        loading,
        error,
        validationErrors,
        onSignUpPress,
        onVerifyPress,
        resendVerificationCode,
        isFormValid: !validationErrors.email && !validationErrors.password && emailAddress.trim() && password.trim(),
    }
}
