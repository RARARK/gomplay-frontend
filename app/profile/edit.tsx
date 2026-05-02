import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  updateMyProfile,
  uploadProfileImage,
} from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";

const DEFAULT_AVATAR = require("../../assets/match/Ellipse-12.png");
const BIO_MAX_LENGTH = 100;

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );
}

export default function ProfileEditRoute() {
  const { profile, clearProfile } = useUserStore();

  const [photoUri, setPhotoUri] = React.useState<string | null>(
    profile?.profileImageUrl ?? null
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

  const [bio, setBio] = React.useState(profile?.bio ?? "");
  const [isSavingBio, setIsSavingBio] = React.useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    setIsUploadingPhoto(true);

    try {
      const imageUrl = await uploadProfileImage(uri);
      await updateMyProfile({ profileImageUrl: imageUrl });
      clearProfile();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "이미지 업로드 실패";
      Alert.alert("업로드 실패", message);
      setPhotoUri(profile?.profileImageUrl ?? null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      await updateMyProfile({ bio: bio.trim() });
      clearProfile();
      Alert.alert("저장 완료", "소개가 업데이트됐어요.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "저장 실패";
      Alert.alert("저장 실패", message);
    } finally {
      setIsSavingBio(false);
    }
  };

  const bioChanged = bio.trim() !== (profile?.bio ?? "").trim();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>프로필 편집</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 프로필 사진 */}
        <View style={styles.photoSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={photoUri ? { uri: photoUri } : DEFAULT_AVATAR}
              style={styles.avatar}
              contentFit="cover"
            />
            <Pressable
              accessibilityRole="button"
              style={styles.photoEditBadge}
              onPress={handlePickImage}
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
          <Text style={styles.photoHint}>
            {isUploadingPhoto ? "업로드 중..." : "프로필 사진 변경"}
          </Text>
        </View>

        {/* 소개 */}
        <View style={styles.section}>
          <SectionLabel label="소개" />
          <View style={styles.card}>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="나를 소개해보세요"
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={BIO_MAX_LENGTH}
              editable={!isSavingBio}
            />
            <View style={styles.bioFooter}>
              <Text style={styles.bioCount}>
                {bio.length}/{BIO_MAX_LENGTH}
              </Text>
              <Pressable
                style={[
                  styles.bioSaveButton,
                  (!bioChanged || isSavingBio) && styles.bioSaveButtonDisabled,
                ]}
                onPress={handleSaveBio}
                disabled={!bioChanged || isSavingBio}
              >
                {isSavingBio ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.bioSaveText}>저장</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>

        {/* 계정 */}
        <View style={styles.section}>
          <SectionLabel label="계정" />
          <View style={styles.card}>
            <MenuRow
              icon={<Ionicons name="lock-closed-outline" size={20} color="#4C5BE2" />}
              label="비밀번호 변경"
              onPress={() => router.push("/profile/edit-password" as any)}
            />
          </View>
        </View>

        {/* 내 정보 */}
        <View style={styles.section}>
          <SectionLabel label="내 정보" />
          <View style={styles.card}>
            <MenuRow
              icon={<Ionicons name="calendar-outline" size={20} color="#4C5BE2" />}
              label="시간표 수정"
              onPress={() => router.push("/profile/edit-timetable" as any)}
            />
            <View style={styles.divider} />
            <MenuRow
              icon={<Ionicons name="person-outline" size={20} color="#4C5BE2" />}
              label="성향 수정"
              onPress={() => router.push("/profile/edit-personality" as any)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },

  photoSection: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
  },
  photoEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  photoHint: {
    fontSize: 13,
    color: "#4C5BE2",
    fontWeight: "700",
  },

  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
    paddingHorizontal: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: 52,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuIcon: {
    width: 24,
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },

  bioInput: {
    minHeight: 90,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    fontSize: 14,
    color: "#111827",
    fontFamily: "System",
    textAlignVertical: "top",
  },
  bioFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bioCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  bioSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
    minWidth: 48,
    alignItems: "center",
  },
  bioSaveButtonDisabled: {
    opacity: 0.4,
  },
  bioSaveText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
