import { SignOutButton } from "@/components/SignOutButton";
import { useThemeContext } from "@/context/themeContext";
import { supabase } from "@/utils/supabase";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Edit3, User, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { theme } = useThemeContext();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Open edit modal
  const handleOpenEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setSelectedImage(null);
    setShowEditModal(true);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First name and last name are required.");
      return;
    }

    setUpdating(true);
    try {
      // Update first name and last name
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Update profile image if selected
      if (selectedImage) {
        // 1. Upload image to Supabase storage
        const fileExt = selectedImage.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        // Fetch the image file and convert to ArrayBuffer (React Native compatible)
        const response = await fetch(selectedImage);
        const arrayBuffer = await response.arrayBuffer();
        
        // Upload to Supabase storage bucket 'userimage' using ArrayBuffer
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('userimage')
          .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // 2. Get public URL from Supabase
        const { data: publicUrlData } = supabase.storage
          .from('userimage')
          .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // 3. Store the image URL in Clerk user metadata
        await user?.update({
          unsafeMetadata: {
            ...user?.unsafeMetadata,
            profileImageUrl: publicUrl,
          },
        });
      }

      Alert.alert("Success", "Profile updated successfully!");
      setShowEditModal(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error?.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView
      className={
        theme === "dark" ? "flex-1 bg-gray-900" : "flex-1 bg-gray-50"
      }
    >
      <View className="flex-1 px-6 pt-6">
        <Text
          className={
            theme === "dark"
              ? "text-2xl font-bold text-gray-100 mb-6"
              : "text-2xl font-bold text-gray-900 mb-6"
          }
        >
          Profile
        </Text>

        <View className="items-center mb-8">
          {(user?.unsafeMetadata?.profileImageUrl as string) || user?.imageUrl ? (
            <Image
              source={{ uri: (user?.unsafeMetadata?.profileImageUrl as string) || user?.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View
              className={
                theme === "dark"
                  ? "w-24 h-24 rounded-full bg-gray-800 items-center justify-center mb-4"
                  : "w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-4"
              }
            >
              <Text
                className={
                  theme === "dark"
                    ? "text-3xl font-bold text-gray-400"
                    : "text-3xl font-bold text-gray-600"
                }
              >
                {user?.firstName?.charAt(0) || "U"}
              </Text>
            </View>
          )}

          <Text
            className={
              theme === "dark"
                ? "text-xl font-bold text-gray-100"
                : "text-xl font-bold text-gray-900"
            }
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            className={
              theme === "dark"
                ? "text-sm text-gray-400 mt-1"
                : "text-sm text-gray-500 mt-1"
            }
          >
            {user?.emailAddresses[0]?.emailAddress}
          </Text>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={handleOpenEdit}
            className={
              theme === "dark"
                ? "mt-4 px-6 py-2 rounded-xl bg-blue-600 flex-row items-center gap-2"
                : "mt-4 px-6 py-2 rounded-xl bg-blue-500 flex-row items-center gap-2"
            }
          >
            <Edit3 size={16} color="#FFFFFF" />
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

       <SignOutButton/>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View
            className={
              theme === "dark"
                ? "bg-gray-900 rounded-t-3xl"
                : "bg-white rounded-t-3xl"
            }
            style={{ maxHeight: "85%" }}
          >
            {/* Header */}
            <View
              className={
                theme === "dark"
                  ? "px-6 py-4 border-b border-gray-800 flex-row items-center justify-between"
                  : "px-6 py-4 border-b border-gray-200 flex-row items-center justify-between"
              }
            >
              <Text
                className={
                  theme === "dark"
                    ? "text-xl font-bold text-gray-100"
                    : "text-xl font-bold text-gray-900"
                }
              >
                Edit Profile
              </Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className={
                  theme === "dark"
                    ? "bg-gray-800 p-2 rounded-full"
                    : "bg-gray-100 p-2 rounded-full"
                }
              >
                <X size={20} color={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              className="px-6 py-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Image */}
              <View className="items-center mb-6">
                <View className="relative">
                  {selectedImage || (user?.unsafeMetadata?.profileImageUrl as string) || user?.imageUrl ? (
                    <Image
                      source={{ uri: selectedImage || (user?.unsafeMetadata?.profileImageUrl as string) || user?.imageUrl }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <View
                      className={
                        theme === "dark"
                          ? "w-24 h-24 rounded-full bg-gray-800 items-center justify-center"
                          : "w-24 h-24 rounded-full bg-gray-200 items-center justify-center"
                      }
                    >
                      <User
                        size={40}
                        color={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={pickImage}
                    className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Camera size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text
                  className={
                    theme === "dark"
                      ? "text-xs text-gray-400 mt-2"
                      : "text-xs text-gray-500 mt-2"
                  }
                >
                  Tap camera icon to change photo
                </Text>
              </View>

              {/* First Name */}
              <View className="mb-4">
                <Text
                  className={
                    theme === "dark"
                      ? "text-sm font-semibold text-gray-300 mb-2"
                      : "text-sm font-semibold text-gray-700 mb-2"
                  }
                >
                  First Name
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor={theme === "dark" ? "#6B7280" : "#9CA3AF"}
                  className={
                    theme === "dark"
                      ? "px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100"
                      : "px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900"
                  }
                />
              </View>

              {/* Last Name */}
              <View className="mb-6">
                <Text
                  className={
                    theme === "dark"
                      ? "text-sm font-semibold text-gray-300 mb-2"
                      : "text-sm font-semibold text-gray-700 mb-2"
                  }
                >
                  Last Name
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor={theme === "dark" ? "#6B7280" : "#9CA3AF"}
                  className={
                    theme === "dark"
                      ? "px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100"
                      : "px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900"
                  }
                />
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  className={
                    theme === "dark"
                      ? "flex-1 px-6 py-4 rounded-xl bg-gray-800 border border-gray-700"
                      : "flex-1 px-6 py-4 rounded-xl bg-gray-100 border border-gray-200"
                  }
                  disabled={updating}
                >
                  <Text
                    className={
                      theme === "dark"
                        ? "text-center font-semibold text-gray-300"
                        : "text-center font-semibold text-gray-700"
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  className="flex-1 px-6 py-4 rounded-xl bg-blue-500"
                  style={{
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-center font-semibold text-white">
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
