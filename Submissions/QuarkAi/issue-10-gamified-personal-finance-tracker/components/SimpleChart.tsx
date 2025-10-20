import { useThemeContext } from '@/context/themeContext'
import React from 'react'
import { Text, View } from 'react-native'

interface ChartData {
  label: string
  value: number
  color: string
}

interface SimpleChartProps {
  data: ChartData[]
  maxValue: number
}

export default function SimpleChart({ data, maxValue }: SimpleChartProps) {
  const { theme } = useThemeContext()

  if (data.length === 0) {
    return (
      <View
        className={`p-6 rounded-2xl border border-dashed items-center ${
          theme === 'dark'
            ? 'bg-gray-800/30 border-gray-700'
            : 'bg-white/30 border-gray-300'
        }`}
      >
        <Text
          className={`text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          No data to display
        </Text>
      </View>
    )
  }

  return (
    <View
      className={`p-4 rounded-2xl border shadow-md ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
          : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
      }`}
    >
      <View className="flex-row items-end justify-between" style={{ height: 150 }}>
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 120 : 0
          return (
            <View key={index} className="flex-1 items-center justify-end mx-1">
              {item.value > 0 && (
                <View className="items-center mb-2">
                  <Text
                    className={`text-xs font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    ${item.value.toFixed(0)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  height: Math.max(height, 10),
                  backgroundColor: item.color,
                  borderRadius: 8,
                  width: '100%',
                }}
              />
              <Text
                className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
