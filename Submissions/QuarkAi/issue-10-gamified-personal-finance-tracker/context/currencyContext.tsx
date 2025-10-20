import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 277.5 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', rate: 3.75 },
]

interface CurrencyContextProps {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertAmount: (amount: number) => number
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextProps>({
  selectedCurrency: CURRENCIES[0],
  setSelectedCurrency: () => {},
  convertAmount: (amount: number) => amount,
  formatAmount: (amount: number) => `$${amount.toFixed(2)}`,
})

const STORAGE_KEY = '@expense_tracker_currency'

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(CURRENCIES[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadCurrency()
  }, [])

  const loadCurrency = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const currencyCode = JSON.parse(stored)
        const currency = CURRENCIES.find(c => c.code === currencyCode)
        if (currency) {
          setSelectedCurrencyState(currency)
        }
      }
    } catch (error) {
      console.error('Error loading currency:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  const setSelectedCurrency = async (currency: Currency) => {
    try {
      setSelectedCurrencyState(currency)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currency.code))
    } catch (error) {
      console.error('Error saving currency:', error)
    }
  }

  const convertAmount = (amount: number): number => {
    return amount * selectedCurrency.rate
  }

  const formatAmount = (amount: number): string => {
    const converted = convertAmount(amount)
    return `${selectedCurrency.symbol}${converted.toFixed(2)}`
  }

  if (!isLoaded) {
    return null
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertAmount,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
