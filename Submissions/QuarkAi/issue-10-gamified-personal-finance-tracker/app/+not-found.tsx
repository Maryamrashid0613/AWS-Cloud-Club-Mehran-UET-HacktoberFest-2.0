import { useThemeContext } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { Wallet } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto redirect to home after loading
    const timer = setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <View className="mb-12">
            <View className={`w-28 h-28 rounded-3xl items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/60' 
                : 'bg-white/50 border border-gray-200/60'
            }`}>
              <Wallet 
                size={56} 
                color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} 
                strokeWidth={1.5} 
              />
            </View>
          </View>

          {/* App Name */}
          <View className="items-center mb-8">
            <Text className={`text-3xl font-bold text-center tracking-tight ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Gamified Personal
            </Text>
            <Text className={`text-5xl font-bold text-center tracking-tight ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Finance Tracker
            </Text>
          </View>

          {/* Tagline */}
          <View className={`px-8 py-4 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700/60' 
              : 'bg-white/50 border border-gray-200/60'
          }`}>
            <Text className={`text-base text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Level Up • Earn Rewards • Save Smart
            </Text>
          </View>

          {/* Loading Indicator */}
          <View className="mt-14">
            <ActivityIndicator 
              size="large" 
              color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} 
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
