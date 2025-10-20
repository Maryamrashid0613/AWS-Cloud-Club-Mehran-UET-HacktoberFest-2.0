
import TransactionModal from "@/components/TransactionModal";
import WalletModal from "@/components/WalletModal";
import { useData } from "@/context/dataContext";
import { useThemeContext } from "@/context/themeContext";
import { useTransaction } from "@/hooks/useTransaction";
import { Tabs } from "expo-router";
import { Bot, Home, List, Plus, User } from "lucide-react-native";
import { useState } from "react";
import { Alert, Platform, TouchableOpacity, View } from "react-native";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useThemeContext();
  const { wallets, createWallet, createTransaction } = useData();
  const { pickImage } = useTransaction();
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);

  return (
    <>
      <View
        className={
          theme === "dark"
            ? "flex-row bg-gray-900 border-t border-gray-800"
            : "flex-row bg-white border-t border-gray-200"
        }
        style={{
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: theme === "dark" ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Center Add Button
        if (route.name === "add") {
          return (
            <View key={route.key} className="flex-1 items-center justify-center">
              <TouchableOpacity
                onPress={() => {
                  if (wallets.length === 0) {
                    Alert.alert(
                      "No Wallet",
                      "Please create a wallet first before adding transactions.",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Create Wallet", onPress: () => setIsWalletModalVisible(true) }
                      ]
                    );
                  } else {
                    setIsTransactionModalVisible(true);
                  }
                }}
                className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center -mt-6"
                style={{
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          );
        }

        // Regular Tabs
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            <View className="items-center justify-center">
              {route.name === "index" && (
                <Home
                  size={24}
                  color={isFocused ? "#3B82F6" : theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  fill={isFocused ? "#3B82F6" : "none"}
                  strokeWidth={isFocused ? 2 : 2}
                />
              )}
              {route.name === "transactions" && (
                <List
                  size={24}
                  color={isFocused ? "#3B82F6" : theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              )}
              {route.name === "aichat" && (
                <Bot
                  size={24}
                  color={isFocused ? "#3B82F6" : theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  fill={isFocused ? "#3B82F6" : "none"}
                  strokeWidth={isFocused ? 2 : 2}
                />
              )}
              {route.name === "profile" && (
                <User
                  size={24}
                  color={isFocused ? "#3B82F6" : theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  fill={isFocused ? "#3B82F6" : "none"}
                  strokeWidth={isFocused ? 2 : 2}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      </View>
      
      <WalletModal
        visible={isWalletModalVisible}
        onClose={() => setIsWalletModalVisible(false)}
        onSave={async (data) => {
          try {
            // Close modal first to prevent navigation context issues
            setIsWalletModalVisible(false);
            // Small delay to ensure modal is fully closed
            await new Promise(resolve => setTimeout(resolve, 100));
            // Then create wallet
            await createWallet(data);
          } catch (error) {
            console.error('Error creating wallet:', error);
          }
        }}
      />

      <TransactionModal
        visible={isTransactionModalVisible}
        onClose={() => setIsTransactionModalVisible(false)}
        onSave={async (data) => {
          try {
            // Close modal first to prevent navigation context issues
            setIsTransactionModalVisible(false);
            // Small delay to ensure modal is fully closed
            await new Promise(resolve => setTimeout(resolve, 100));
            // Then create transaction
            await createTransaction(data);
          } catch (error) {
            console.error('Error creating transaction:', error);
            // Optionally show error to user
          }
        }}
        wallets={wallets}
        onPickImage={pickImage}
      />
    </>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
      <Tabs.Screen name="aichat" options={{ title: "Assistant" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
