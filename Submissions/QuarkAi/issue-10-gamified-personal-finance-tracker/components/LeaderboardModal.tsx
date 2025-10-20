import { useThemeContext } from '@/context/themeContext'
import { useUserContext } from '@/context/userContext'
import { supabase } from '@/utils/supabase'
import { Award, Crown, Medal, TrendingUp, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface LeaderboardUser {
  id: number
  name: string | null
  email: string | null
  level: number
  points: number
  uuid: string
}

interface LeaderboardModalProps {
  visible: boolean
  onClose: () => void
}

export default function LeaderboardModal({ visible, onClose }: LeaderboardModalProps) {
  const { theme } = useThemeContext()
  const { user } = useUserContext()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(false)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    if (visible) {
      fetchLeaderboard()
    }
  }, [visible])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, level, points, uuid')
        .order('points', { ascending: false })
        .limit(100)

      if (error) throw error

      setLeaderboard(data || [])
      
      if (user) {
        const rank = (data || []).findIndex((u) => u.uuid === user.uuid)
        setUserRank(rank >= 0 ? rank + 1 : null)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" fill="#FFD700" />
      case 2:
        return <Medal size={24} color="#C0C0C0" fill="#C0C0C0" />
      case 3:
        return <Medal size={24} color="#CD7F32" fill="#CD7F32" />
      default:
        return null
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 border-yellow-500/60'
      case 2:
        return 'bg-gray-400/20 border-gray-400/60'
      case 3:
        return 'bg-orange-600/20 border-orange-600/60'
      default:
        return theme === 'dark' ? 'bg-gray-700/50 border-gray-600/60' : 'bg-gray-200/50 border-gray-300/60'
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1">
          <View className={`px-6 pt-4 pb-4 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}>
                  <TrendingUp size={20} color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} />
                </View>
                <Text
                  className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Leaderboard
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-200/60'
                }`}
              >
                <X size={24} color={theme === 'dark' ? '#F3F4F6' : '#111827'} />
              </TouchableOpacity>
            </View>

            {user && userRank && (
              <View
                className={`p-4 rounded-3xl border shadow-md mt-4 ${
                  theme === 'dark'
                    ? 'bg-blue-900/30 border-blue-700/60 shadow-black/30'
                    : 'bg-blue-100/50 border-blue-300/60 shadow-blue-200/50'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}
                    >
                      Your Rank
                    </Text>
                    <Text
                      className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
                      }`}
                    >
                      #{userRank}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className={`text-sm ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}
                    >
                      Level {user.level}
                    </Text>
                    <Text
                      className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
                      }`}
                    >
                      {user.points} pts
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <ScrollView 
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            <View className="py-4">
              <View className="flex-row items-center mb-4">
                <Award size={20} color={theme === 'dark' ? '#10B981' : '#059669'} />
                <Text
                  className={`text-base font-semibold ml-2 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Top Performers
                </Text>
              </View>

              {loading ? (
                <View className="py-8 items-center">
                  <ActivityIndicator
                    color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                    size="large"
                  />
                </View>
              ) : leaderboard.length === 0 ? (
                <View className="py-8 items-center">
                  <Text
                    className={`text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No users found
                  </Text>
                </View>
              ) : (
                <View className="gap-3 pb-6">
                  {leaderboard.map((leaderUser, index) => {
                    const rank = index + 1
                    const isCurrentUser = user?.uuid === leaderUser.uuid
                    
                    return (
                      <View
                        key={leaderUser.id}
                        className={`p-4 rounded-2xl border ${
                          isCurrentUser
                            ? theme === 'dark'
                              ? 'bg-blue-900/40 border-blue-700/60'
                              : 'bg-blue-100/60 border-blue-300/60'
                            : theme === 'dark'
                            ? 'bg-gray-700/40 border-gray-600/60'
                            : 'bg-white/60 border-gray-200/60'
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View
                            className={`w-12 h-12 rounded-full items-center justify-center border-2 mr-3 ${getRankBadgeColor(
                              rank
                            )}`}
                          >
                            {getRankIcon(rank) || (
                              <Text
                                className={`text-lg font-bold ${
                                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                }`}
                              >
                                {rank}
                              </Text>
                            )}
                          </View>

                          <View className="flex-1">
                            <Text
                              className={`text-base font-semibold mb-1 ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}
                              numberOfLines={1}
                            >
                              {leaderUser.name || 'Anonymous User'}
                              {isCurrentUser && (
                                <Text className={`text-sm font-normal ${
                                  theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                }`}> (You)</Text>
                              )}
                            </Text>
                            <View className="flex-row items-center gap-3">
                              <Text
                                className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                Level {leaderUser.level}
                              </Text>
                              <View
                                className={`h-1 w-1 rounded-full ${
                                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                                }`}
                              />
                              <Text
                                className={`text-sm font-semibold ${
                                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}
                              >
                                {leaderUser.points} points
                              </Text>
                            </View>
                          </View>

                          {rank <= 3 && (
                            <View
                              className={`px-3 py-1 rounded-full ${
                                rank === 1
                                  ? 'bg-yellow-500/20'
                                  : rank === 2
                                  ? 'bg-gray-400/20'
                                  : 'bg-orange-600/20'
                              }`}
                            >
                              <Text
                                className={`text-xs font-bold ${
                                  rank === 1
                                    ? 'text-yellow-500'
                                    : rank === 2
                                    ? 'text-gray-400'
                                    : 'text-orange-600'
                                }`}
                              >
                                TOP {rank}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
