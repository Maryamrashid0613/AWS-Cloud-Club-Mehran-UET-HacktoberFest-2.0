import { useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
// Complete the web browser session for OAuth
WebBrowser.maybeCompleteAuthSession()

// Custom hook for SSO authentication (Google & Apple)
export const useAuthHook = () => {
    const router = useRouter()

    // SSO hook
    const { startSSOFlow } = useSSO()

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const [ssoProvider, setSsoProvider] = React.useState<'google' | 'apple' | null>(null)

    // Handle SSO flow completion
    const handleSSOFlow = async (
        strategy: 'oauth_google' | 'oauth_apple',
        provider: 'google' | 'apple'
    ) => {

        setLoading(true)
        setError('')
        setSsoProvider(provider)
        const redirectUrl = AuthSession.makeRedirectUri({
    scheme: 'yourapp', // 👈 use your scheme here
  })

        try {
            const { createdSessionId, signIn, signUp, setActive } = await startSSOFlow({
                strategy,
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {
                await setActive!({ session: createdSessionId ,
                    navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              router.push('/(app)/(tabs)')
              return
            }

            router.push('/')
          }

                },
                        
                )
                router.push('/(app)/(tabs)')
            } else {
                // Handle cases where additional steps might be required
                if (signIn?.firstFactorVerification?.status === 'transferable') {
                    // User needs to complete additional verification
                    setError(`Please complete the ${provider} sign-in process`)
                } else if (signUp?.status === 'missing_requirements') {
                    // User needs to provide additional information
                    setError(`Additional information required for ${provider} sign-up`)
                } else {
                    setError(`${provider} authentication was not completed`)
                }
            }
        } catch (err: any) {
            // console.error(`${provider} SSO error:`, err)

            // Handle specific SSO errors
            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0]

                switch (clerkError.code) {
                    case 'oauth_access_denied':
                        setError(`${provider} access was denied. Please try again.`)
                        break
                    case 'oauth_email_domain_reserved_by_saml':
                        setError('This email domain is managed by your organization. Please use SSO.')
                        break
                    case 'identifier_already_signed_in':
                        setError('You are already signed in with this account.')
                        break
                    case 'oauth_callback_protection':
                        setError('OAuth callback protection error. Please try again.')
                        break
                    case 'session_exists':
                        setError('You are already signed in.')
                        break
                    case 'form_identifier_exists':
                        setError(`An account with this ${provider} email already exists. Please sign in instead.`)
                        break
                    case 'sso_callback_error':
                        setError(`${provider} SSO callback error. Please try again.`)
                        break
                    default:
                        setError(clerkError.message || `Failed to sign in with ${provider}`)
                }
            } else if (err.message?.includes('cancelled') || err.message?.includes('canceled') || err.message?.includes('UserCancel')) {
                // User cancelled the SSO flow - don't show error
                setError('')
            } else if (err.message?.includes('Network')) {
                setError('Network error. Please check your connection and try again.')
            } else {
                setError(`An error occurred during ${provider} sign-in. Please try again.`)
            }
        } finally {
            setLoading(false)
            setSsoProvider(null)
        }
    }

    // Google SSO handler
    const signInWithGoogle = async () => {
        await handleSSOFlow('oauth_google', 'google')
    }

    // Apple SSO handler  
    const signInWithApple = async () => {
        await handleSSOFlow('oauth_apple', 'apple')
    }

    // Clear error
    const clearError = () => {
        setError('')
    }

    return {
        signInWithGoogle,
        signInWithApple,
        loading,
        error,
        ssoProvider,
        clearError,
        isGoogleLoading: loading && ssoProvider === 'google',
        isAppleLoading: loading && ssoProvider === 'apple',
    }
}


