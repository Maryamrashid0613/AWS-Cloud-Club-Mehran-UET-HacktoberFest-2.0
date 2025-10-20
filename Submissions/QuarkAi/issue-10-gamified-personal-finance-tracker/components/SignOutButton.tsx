import { useThemeContext } from '@/context/themeContext'
import { useClerk } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const { theme } = useThemeContext()
  
  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/authscreen')
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  
  return (
    <TouchableOpacity 
      onPress={handleSignOut} 
      className={`flex-row items-center rounded-full py-3 px-6 shadow-sm min-w-[140px] justify-center gap-3 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-300'
      }`}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="log-out-outline" 
        size={20} 
        color={theme === 'dark' ? '#F3F4F6' : '#000000'} 
      />
      <Text className={`text-base font-semibold tracking-wide ${
        theme === 'dark' ? 'text-gray-100' : 'text-black'
      }`}>
        Sign Out
      </Text>
    </TouchableOpacity>
  )
}