import React, { createContext, ReactNode, useContext } from 'react'
import { useUserHook, User } from '@/hooks/useUserHook'

interface UserContextProps {
  user: User | null
  loading: boolean
  error: string | null
  updateUserPoints: (pointsToAdd: number) => Promise<User | undefined>
  updateUserLevel: (newLevel: number) => Promise<User | undefined>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: false,
  error: null,
  updateUserPoints: async () => undefined,
  updateUserLevel: async () => undefined,
  refreshUser: async () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userHook = useUserHook()

  return (
    <UserContext.Provider value={userHook}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
