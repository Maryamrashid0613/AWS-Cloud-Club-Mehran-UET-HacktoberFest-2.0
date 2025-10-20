import { useThemeContext } from '@/context/themeContext'
import { Link } from 'expo-router'
import * as React from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuthHook } from '../../hooks/useAuthHook'
import { useSignInHook } from '../../hooks/useSignInHook'

//  CUSTOMIZABLE VARIABLES - Edit these to change branding
const PRODUCT_NAME = 'QuarkFi'
const SIGNIN_TAGLINE = 'Continue your journey to financial mastery'

export default function SignInScreen() {
  const { theme } = useThemeContext()
  
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    loading,
    error,
    validationErrors,
    onSignInPress,
    isFormValid,
  } = useSignInHook()

  const {
    signInWithGoogle,
    signInWithApple,
    loading: ssoLoading,
    error: ssoError,
    isGoogleLoading,
    isAppleLoading,
    clearError,
  } = useAuthHook()

  React.useEffect(() => {
    clearError()
  }, [clearError])

  return (
    <KeyboardAvoidingView 
      behavior='padding' 
      keyboardVerticalOffset={Platform.OS==='ios' ? 100 : 0}
      className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header Card with Glassmorphism */}
          <View className={`p-6 rounded-3xl mb-8 border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700/60' 
              : 'bg-white/50 border-gray-200/60'
          }`}>
            <Text className={`text-3xl font-bold text-center mb-3 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Welcome Back
            </Text>
            <Text className={`text-center text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {SIGNIN_TAGLINE}
            </Text>
          </View>

          {/* Error Message */}
          {(error || ssoError) ? (
            <View className={`rounded-3xl p-4 mb-6 border ${
              theme === 'dark' 
                ? 'bg-red-900/30 border-red-400 text-red-100' 
                : 'bg-red-100 border-red-600'
            }`}>
              <Text className={`text-center ${
                theme === 'dark' ? 'text-red-100' : 'text-red-600'
              }`}>{error || ssoError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="mb-6">
            {/* Email Input */}
            <View className="mb-4">
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                className={`px-6 py-5 rounded-3xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                } ${
                  validationErrors.email 
                    ? 'border border-red-500' 
                    : theme === 'dark' 
                      ? 'border border-gray-700' 
                      : ''
                }`}
              />
              {validationErrors.email && (
                <Text className={`text-sm mt-2 ml-4 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {validationErrors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <TextInput
                value={password}
                placeholder="Enter your password"
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                secureTextEntry={true}
                onChangeText={setPassword}
                className={`px-6 py-5 rounded-3xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                } ${
                  validationErrors.password 
                    ? 'border border-red-500' 
                    : theme === 'dark' 
                      ? 'border border-gray-700' 
                      : ''
                }`}
              />
              {validationErrors.password && (
                <Text className={`text-sm mt-2 ml-4 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {validationErrors.password}
                </Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <View className="items-end mb-6">
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Text className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={loading || !isFormValid}
            className={`py-5 rounded-3xl mb-8 shadow-md ${
              theme === 'dark' ? 'bg-gray-700 shadow-black/30' : 'bg-gray-100 shadow-gray-200/50'
            } ${
              loading || !isFormValid ? 'opacity-40' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text className={`text-lg font-semibold text-center ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className={`flex-1 h-px ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`} />
            <Text className={`mx-4 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>or</Text>
            <View className={`flex-1 h-px ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`} />
          </View>

          {/* Social Sign In Buttons */}
          <View className="flex-row items-center justify-center mb-10">
            <TouchableOpacity 
              onPress={signInWithGoogle}
              disabled={ssoLoading || loading}
              className={`w-16 h-16 rounded-full items-center justify-center border shadow-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/60 border-gray-700 shadow-black/30' 
                  : 'bg-white/60 border-gray-200 shadow-gray-200/50'
              } ${
                (ssoLoading || loading) ? 'opacity-40' : ''
              }`}
              activeOpacity={0.8}
            >
              {isGoogleLoading ? (
                <View className={`w-5 h-5 border-2 rounded-full ${
                  theme === 'dark' 
                    ? 'border-gray-600 border-t-blue-400' 
                    : 'border-gray-300 border-t-blue-500'
                }`} />
              ) : (
                <Image
                  source={require('../../assets/images/google.png')}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
            
            <View className="w-6" />
            
            <TouchableOpacity 
              onPress={signInWithApple}
              disabled={ssoLoading || loading}
              className={`w-16 h-16 rounded-full items-center justify-center border shadow-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/60 border-gray-700 shadow-black/30' 
                  : 'bg-white/60 border-gray-200 shadow-gray-200/50'
              } ${
                (ssoLoading || loading) ? 'opacity-40' : ''
              }`}
              activeOpacity={0.8}
            >
              {isAppleLoading ? (
                <View className={`w-5 h-5 border-2 rounded-full ${
                  theme === 'dark' 
                    ? 'border-gray-600 border-t-gray-100' 
                    : 'border-gray-300 border-t-gray-900'
                }`} />
              ) : (
                <Image
                  source={require('../../assets/images/apple.png')}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don&apos;t have an account?{' '}
            </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className={`font-bold text-base ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

