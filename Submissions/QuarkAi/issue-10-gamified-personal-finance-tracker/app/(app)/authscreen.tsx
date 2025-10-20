import { useThemeContext } from '@/context/themeContext'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// CUSTOMIZABLE VARIABLES - Edit these to change branding
const PRODUCT_NAME = 'QuarkFi'
const WELCOME_TAGLINE = 'Turn saving into winning!\nComplete challenges, earn rewards, and level up your finances'

const AuthScreen = () => {
  const router = useRouter()
  const { theme } = useThemeContext()

  return (
    <View className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 justify-center items-center px-8">
        {/* Welcome Card with Glassmorphism */}
        <View className={`p-8 rounded-3xl mb-12 border ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700/60' 
            : 'bg-white/50 border-gray-200/60'
        }`}>
          <Text className={`text-4xl font-bold mb-4 text-center ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Welcome to
          </Text>
          <Text className={`text-4xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {PRODUCT_NAME}
          </Text>
          <Text className={`text-base text-center leading-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {WELCOME_TAGLINE}
          </Text>
        </View>

        {/* Auth buttons */}
        <View className="w-full mb-8">
          <TouchableOpacity 
            onPress={() => router.push('/register')}
            className={`py-5 px-8 rounded-3xl mb-4 shadow-md ${
              theme === 'dark' ? 'bg-gray-700 shadow-black/30' : 'bg-gray-100 shadow-gray-200/50'
            }`}
            activeOpacity={0.8}
          >
            <Text className={`text-lg font-semibold text-center ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className={`py-5 px-8 rounded-3xl border shadow-md ${
              theme === 'dark' 
                ? 'bg-gray-800/60 border-gray-700 shadow-black/30' 
                : 'bg-white/60 border-gray-200 shadow-gray-200/50'
            }`}
            activeOpacity={0.8}
          >
            <Text className={`text-lg font-semibold text-center ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer text */}
        <View className="absolute bottom-12 items-center px-8">
          <Text className={`text-sm text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            By continuing, you agree to our{' '}
            <Text className={`font-semibold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>Terms</Text>
            {' & '}
            <Text className={`font-semibold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default AuthScreen

