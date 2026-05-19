import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CreatePostCapacitySelector from "@/components/matching/create-post/CreatePostCapacitySelector";
import CreatePostTagSelector from "@/components/matching/create-post/CreatePostTagSelector";
import {
  CREATE_POST_MAX_TAG_SELECTION,
  CREATE_POST_TAG_OPTIONS,
} from "@/components/matching/create-post/createPostConfig";
import {
  getPostById,
  getPostParticipants,
  updatePost,
} from "@/services/post/postService";

const BIO_MAX_LENGTH = 200;

export default function EditPostRoute() {
  const { postId: postIdParam } = useLocalSearchParams<{ postId?: string }>();
  const postId = Number(postIdParam);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [minCapacity, setMinCapacity] = React.useState(1);

  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [capacity, setCapacity] = React.useState(1);
  const [message, setMessage] = React.useState("");
  const [isTagSelectorExpanded, setIsTagSelectorExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!postId) return;

    Promise.all([getPostById(postId), getPostParticipants(postId)])
      .then(([post, participants]) => {
        if (!post) {
          Alert.alert("오류", "게시글을 찾을 수 없어요.", [
            { text: "확인", onPress: () => router.back() },
          ]);
          return;
        }
        const currentCount = participants.length;
        setTitle(post.title ?? "");
        setTags(post.tags ?? []);
        setCapacity(post.capacity);
        setMessage(post.message ?? "");
        setMinCapacity(Math.max(1, currentCount));
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleToggleTag = (tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= CREATE_POST_MAX_TAG_SELECTION) return prev;
      return [...prev, tag];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePost(postId, {
        title: title.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        capacity,
        message: message.trim() || undefined,
      });
      router.back();
    } catch (err) {
      Alert.alert(
        "저장 실패",
        err instanceof Error ? err.message : "다시 시도해주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4C5BE2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#111111" />
            </Pressable>
            <Text style={styles.headerTitle}>모집글 수정</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={15} color="#6B7280" />
            <Text style={styles.noticeText}>
              날짜·시간·장소·운동 종목은 수정할 수 없어요.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>제목</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목: 같이 운동하실 분 구해요"
              placeholderTextColor="#8F95A1"
              style={styles.singleLineInput}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>태그</Text>
            <CreatePostTagSelector
              options={CREATE_POST_TAG_OPTIONS}
              selectedTags={tags}
              maxSelectable={CREATE_POST_MAX_TAG_SELECTION}
              isExpanded={isTagSelectorExpanded}
              onToggleExpanded={() => setIsTagSelectorExpanded((v) => !v)}
              onToggleTag={handleToggleTag}
            />
          </View>

          <View style={styles.section}>
            <CreatePostCapacitySelector
              value={capacity}
              onChange={setCapacity}
              min={minCapacity}
            />
            {minCapacity > 1 ? (
              <Text style={styles.capacityHint}>
                현재 참여자 {minCapacity}명 이상으로만 설정할 수 있어요.
              </Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>추가 설명</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="예: 초보도 환영하고, 1시간 정도 가볍게 같이 뛰실 분 찾아요."
              placeholderTextColor="#8F95A1"
              multiline
              numberOfLines={5}
              maxLength={BIO_MAX_LENGTH}
              style={styles.messageInput}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {message.length}/{BIO_MAX_LENGTH}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            disabled={isSaving}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "저장 중..." : "수정 완료"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 20,
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
  headerSpacer: { width: 40 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
    fontWeight: "600",
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "800",
  },
  singleLineInput: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
  },
  capacityHint: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  messageInput: {
    minHeight: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "right",
  },
  saveButton: {
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveButtonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  saveButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
