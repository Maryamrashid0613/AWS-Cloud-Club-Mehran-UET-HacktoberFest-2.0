import { CURRENCIES, Currency, useCurrency } from '@/context/currencyContext'
import { useThemeContext } from '@/context/themeContext'
import { Check } from 'lucide-react-native'
import React from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface CurrencyModalProps {
  visible: boolean
  onClose: () => void
}

export default function CurrencyModal({ visible, onClose }: CurrencyModalProps) {
  const { theme } = useThemeContext()
  const { selectedCurrency, setSelectedCurrency } = useCurrency()

  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          className={`rounded-t-3xl p-6 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}
          style={{ maxHeight: '70%' }}
        >
          <Text
            className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            Select Currency
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-3">
              {CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  onPress={() => handleSelectCurrency(currency)}
                  className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                    selectedCurrency.code === currency.code
                      ? theme === 'dark'
                        ? 'bg-blue-900/30 border-blue-700'
                        : 'bg-blue-100/50 border-blue-500'
                      : theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white/50 border-gray-200'
                  }`}
                >
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{currency.symbol}</Text>
                      <Text
                        className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {currency.code}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {currency.name}
                    </Text>
                    {currency.code !== 'USD' && (
                      <Text
                        className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        1 USD = {currency.symbol}{currency.rate.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  {selectedCurrency.code === currency.code && (
                    <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center">
                      <Check size={18} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
