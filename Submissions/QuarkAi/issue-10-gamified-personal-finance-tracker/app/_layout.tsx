import { CurrencyProvider } from '@/context/currencyContext'
import { DataProvider } from '@/context/dataContext'
import { ThemeProvider } from '@/context/themeContext'
import { UserProvider } from '@/context/userContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import '../global.css'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ThemeProvider>
        <UserProvider>
          <CurrencyProvider>
            <DataProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }} />
            </DataProvider>
          </CurrencyProvider>
        </UserProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}