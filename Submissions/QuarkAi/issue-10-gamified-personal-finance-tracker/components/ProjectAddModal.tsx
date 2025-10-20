import { useThemeContext } from "@/context/themeContext";
import { ProjectRow, useSupabaseTable } from "@/hooks/useProjectTable";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { AlertCircle, Upload, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProjectAddModalProps {
  visible: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const PROJECT_COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Orange
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

const PROJECT_STATUSES = ["Active", "On Hold", "Completed", "Archived"];

export default function ProjectAddModal({ visible, onClose, onProjectCreated }: ProjectAddModalProps) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const { user } = useUser();
  const { loading, error, addData } = useSupabaseTable<ProjectRow>('projects');

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);
  const [selectedStatus, setSelectedStatus] = useState(PROJECT_STATUSES[0]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isFormValid = projectName.trim().length > 0;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreateProject = async() => {
    if (!isFormValid) {
      Alert.alert("Validation Error", "Please enter a project name.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    try {
      await addData({
        userId: user.id,
        projectName: projectName.trim(),
        projectDescription: description.trim(),
        projectColor: selectedColor,
        status: selectedStatus,
        projectPanelImage: selectedImage || 'https://via.placeholder.com/300',
      });

      setProjectName("");
      setDescription("");
      setSelectedColor(PROJECT_COLORS[0]);
      setSelectedStatus(PROJECT_STATUSES[0]);
      setSelectedImage(null);

      onProjectCreated?.();
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <View
          className={isDark ? "bg-gray-900 rounded-3xl w-11/12 max-w-lg" : "bg-white rounded-3xl w-11/12 max-w-lg"}
          style={{
            maxHeight: "85%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.25,
            shadowRadius: 25,
            elevation: 20,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-5">
            <View>
              <Text className={isDark ? "text-white text-2xl font-bold" : "text-gray-900 text-2xl font-bold"}>
                Create Project
              </Text>
              <Text className={isDark ? "text-gray-400 text-sm mt-1" : "text-gray-500 text-sm mt-1"}>
                Add a new project to organize your tasks
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              className={isDark ? "bg-gray-800 p-2 rounded-full" : "bg-gray-100 p-2 rounded-full"}
            >
              <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className={isDark ? "h-px bg-gray-800 mx-6" : "h-px bg-gray-200 mx-6"} />

          {/* Error Message */}
          {error && (
            <View className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 flex-row items-center">
              <AlertCircle size={16} color="#EF4444" />
              <Text className="text-red-500 text-sm ml-2 flex-1">{error}</Text>
            </View>
          )}

          <ScrollView 
            className="px-6 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 20 : 10 }}
          >
            {/* Project Name */}
            <View className="mb-6">
              <Text className={isDark ? "text-gray-300 text-sm font-medium mb-2" : "text-gray-700 text-sm font-medium mb-2"}>
                Project Name
              </Text>
              <TextInput
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Enter project name"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                className={
                  isDark
                    ? "bg-gray-800 text-white rounded-xl px-4 py-3"
                    : "bg-gray-50 text-gray-900 rounded-xl px-4 py-3"
                }
              />
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className={isDark ? "text-gray-300 text-sm font-medium mb-2" : "text-gray-700 text-sm font-medium mb-2"}>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter project description"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className={
                  isDark
                    ? "bg-gray-800 text-white rounded-xl px-4 py-3"
                    : "bg-gray-50 text-gray-900 rounded-xl px-4 py-3"
                }
                style={{ minHeight: 100 }}
              />
            </View>

            {/* Project Color */}
            <View className="mb-6">
              <Text className={isDark ? "text-gray-300 text-sm font-medium mb-3" : "text-gray-700 text-sm font-medium mb-3"}>
                Project Color
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {PROJECT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: isDark ? "#FFF" : "#000",
                    }}
                  >
                    {selectedColor === color && (
                      <View className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View className="mb-6">
              <Text className={isDark ? "text-gray-300 text-sm font-medium mb-3" : "text-gray-700 text-sm font-medium mb-3"}>
                Status
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PROJECT_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setSelectedStatus(status)}
                    className={
                      selectedStatus === status
                        ? "bg-blue-500 px-4 py-2 rounded-full"
                        : isDark
                        ? "bg-gray-800 px-4 py-2 rounded-full"
                        : "bg-gray-100 px-4 py-2 rounded-full"
                    }
                  >
                    <Text
                      className={
                        selectedStatus === status
                          ? "text-white font-medium"
                          : isDark
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Project Panel Image */}
            <View className="mb-6">
              <Text className={isDark ? "text-gray-300 text-sm font-medium mb-2" : "text-gray-700 text-sm font-medium mb-2"}>
                Project Panel Image
              </Text>
              <TouchableOpacity
                onPress={pickImage}
                className={
                  isDark
                    ? "bg-gray-800 rounded-xl overflow-hidden"
                    : "bg-gray-50 rounded-xl overflow-hidden"
                }
                style={{
                  borderWidth: selectedImage ? 0 : 2,
                  borderStyle: 'dashed',
                  borderColor: isDark ? '#374151' : '#D1D5DB'
                }}
              >
                {selectedImage ? (
                  <View>
                    <Image 
                      source={{ uri: selectedImage }} 
                      className="w-full h-40"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 bg-blue-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-medium">Change Image</Text>
                    </View>
                  </View>
                ) : (
                  <View className="py-8 items-center justify-center">
                    <Upload size={32} color={isDark ? "#6B7280" : "#9CA3AF"} />
                    <Text className={isDark ? "text-gray-400 text-sm mt-2" : "text-gray-500 text-sm mt-2"}>
                      Tap to upload image
                    </Text>
                    <Text className={isDark ? "text-gray-500 text-xs mt-1" : "text-gray-400 text-xs mt-1"}>
                      PNG, JPG up to 5MB
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4 mb-6">
              <TouchableOpacity
                onPress={onClose}
                className={
                  isDark
                    ? "flex-1 bg-gray-800 py-4 rounded-xl"
                    : "flex-1 bg-gray-100 py-4 rounded-xl"
                }
              >
                <Text className={isDark ? "text-gray-300 text-center font-semibold" : "text-gray-700 text-center font-semibold"}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateProject}
                disabled={!isFormValid || loading}
                className={`flex-1 py-4 rounded-xl ${
                  !isFormValid || loading ? 'bg-gray-400' : 'bg-blue-500'
                }`}
                style={{
                  shadowColor: !isFormValid || loading ? "#9CA3AF" : "#3B82F6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: !isFormValid || loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-white text-center font-semibold ml-2">
                      Creating...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Create Project
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
