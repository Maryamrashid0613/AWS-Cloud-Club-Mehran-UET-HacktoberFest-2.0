import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useUserContext } from "@/context/userContext";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { loading: userLoading } = useUserContext();

  if (!isLoaded || (isSignedIn && userLoading)) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-100 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="subprojects" options={{ headerShown: false }} />
        
        
        
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="authscreen"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

