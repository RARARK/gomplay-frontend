import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth/authStore";

export default function SignupProfileScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email : "";

  const setPendingProfileImageUri = useAuthStore((s) => s.setPendingProfileImageUri);

  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!imageUri) return;
    setIsLoading(true);
    setPendingProfileImageUri(imageUri);
    router.push({ pathname: "/tutorial", params: { email } });
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>프로필 사진 등록</Text>
          <Text style={styles.subtitle}>
            다른 사용자에게 보여질 프로필 사진을 등록해주세요.
          </Text>
        </View>

        <View style={styles.avatarSection}>
          <Pressable onPress={handlePickImage} style={styles.avatarWrapper}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={64} color="#C7D2FE" />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
          </Pressable>

          <Pressable onPress={handlePickImage} style={styles.selectButton}>
            <Text style={styles.selectButtonText}>
              {imageUri ? "사진 변경" : "사진 선택"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            disabled={!imageUri || isLoading}
            style={[
              styles.nextButton,
              (!imageUri || isLoading) && styles.nextButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>다음</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 48,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 22,
  },
  avatarSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  selectButton: {
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#4C5BE2",
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4C5BE2",
  },
  footer: {
    paddingBottom: 24,
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#C7D2FE",
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
