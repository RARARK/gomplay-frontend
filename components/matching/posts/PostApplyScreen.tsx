import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MatchRunIcon from "@/assets/match/fluent-run-16-filled.svg";
import MatchDifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import {
  CREATE_POST_DIFFICULTY_LABELS,
  CREATE_POST_MAX_TAG_SELECTION,
  CREATE_POST_TAG_OPTIONS,
} from "@/components/matching/create-post/createPostConfig";
import CreatePostDetailCard from "@/components/matching/create-post/CreatePostDetailCard";
import CreatePostLocationCard from "@/components/matching/create-post/CreatePostLocationCard";
import CreatePostTagSelector from "@/components/matching/create-post/CreatePostTagSelector";
import {
  formatCreatePostDayLabel,
  formatCreatePostTimeRangeLabel,
} from "@/components/matching/create-post/createPostUtils";
import {
  deleteGathering,
  joinGathering,
  updateGathering,
} from "@/services/gathering/gatheringService";
import {
  applyToPost,
  getPostById,
  getPostHostProfile,
  getPostParticipants,
  type PostHostProfile,
  type PostParticipant,
  updatePost,
} from "@/services/post/postService";
import { useAuthStore } from "@/stores/auth/authStore";
import { POST_STATUS, type Post } from "@/types/domain/post";

const BIO_MAX_LENGTH = 200;

type PostApplyScreenProps = {
  postId: number;
};

const toDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const isMockPostId = (postId: number) => postId >= 300;

export default function PostApplyScreen({ postId }: PostApplyScreenProps) {
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((s) => s.userId);

  const [post, setPost] = React.useState<Post | null>(null);
  const [host, setHost] = React.useState<PostHostProfile | null>(null);
  const [participants, setParticipants] = React.useState<PostParticipant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [editTitle, setEditTitle] = React.useState("");
  const [editTags, setEditTags] = React.useState<string[]>([]);
  const [editMessage, setEditMessage] = React.useState("");
  const [isTagSelectorExpanded, setIsTagSelectorExpanded] =
    React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadPost = async () => {
      const nextPost = await getPostById(postId);

      if (!nextPost) {
        if (isMounted) setIsLoading(false);
        return;
      }

      const [nextHost, nextParticipants] = await Promise.all([
        getPostHostProfile(nextPost.hostUserId),
        getPostParticipants(nextPost.id),
      ]);

      if (isMounted) {
        setPost(nextPost);
        setHost(nextHost);
        setParticipants(nextParticipants);
        setEditTitle(nextPost.title ?? "");
        setEditTags(nextPost.tags ?? []);
        setEditMessage(nextPost.message ?? "");
        setIsLoading(false);
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const isOwner =
    userId !== null && post !== null && post.hostUserId === userId;
  const canEdit = isOwner && post?.status === POST_STATUS.OPEN;
  const canApply = !isOwner && post?.status === POST_STATUS.OPEN;

  const handleToggleTag = (tag: string) => {
    setEditTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= CREATE_POST_MAX_TAG_SELECTION) return prev;
      return [...prev, tag];
    });
  };

  const handleSave = async () => {
    if (!post) return;
    setIsSaving(true);
    try {
      if (isMockPostId(post.id)) {
        await updatePost(post.id, {
          title: editTitle.trim() || undefined,
          tags: editTags.length > 0 ? editTags : undefined,
          message: editMessage.trim() || undefined,
        });
      } else {
        await updateGathering(post.id, {
          title: editTitle.trim() || undefined,
          tags: editTags.length > 0 ? editTags : undefined,
          description: editMessage.trim() || undefined,
        });
      }
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

  const handleDelete = () => {
    Alert.alert("매칭 취소", "모집을 취소하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          if (!post) return;
          try {
            await deleteGathering(post.id);
            router.back();
          } catch (err) {
            Alert.alert(
              "삭제 실패",
              err instanceof Error ? err.message : "다시 시도해주세요.",
            );
          }
        },
      },
    ]);
  };

  const handleApply = async () => {
    if (!post) return;

    setIsSubmitting(true);
    try {
      if (isMockPostId(post.id)) {
        await applyToPost(
          { postId: post.id },
          {
            currentUserId: userId ?? 0,
            hostUserId: post.hostUserId,
            postStatus: post.status,
            currentParticipantCount: participants.length,
            capacity: post.capacity,
          },
        );
      } else {
        await joinGathering(post.id);
      }
      Alert.alert("신청 완료", "매칭 참여 신청이 완료되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "신청 실패",
        error instanceof Error ? error.message : "다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4C5BE2" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>게시물을 찾을 수 없어요.</Text>
      </View>
    );
  }

  const scheduledStartAt = toDate(post.scheduledStartAt);
  const scheduledEndAt = toDate(post.scheduledEndAt);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 28 + insets.bottom },
        ]}
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
          <Text style={styles.headerTitle}>
            {isOwner ? "내 모집글" : "매칭 참여"}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {canEdit ? (
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#6B7280"
            />
            <Text style={styles.noticeText}>
              날짜·시간·장소·운동 종목은 수정할 수 없어요.
            </Text>
          </View>
        ) : post.status !== POST_STATUS.OPEN ? (
          <View style={styles.notice}>
            <Ionicons name="lock-closed-outline" size={15} color="#6B7280" />
            <Text style={styles.noticeText}>
              마감된 모집글이라 읽기 전용으로만 확인할 수 있어요.
            </Text>
          </View>
        ) : host ? (
          <View style={styles.profileCard}>
            <Image
              source={require("../../../assets/match/Ellipse-12.png")}
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.hostName}>{host.name}</Text>
              <Text style={styles.department}>{host.department}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>제목</Text>
          {canEdit ? (
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="제목: 같이 운동하실 분 구해요"
              placeholderTextColor="#8F95A1"
              style={styles.singleLineInput}
            />
          ) : (
            <View style={styles.singleLineInputView}>
              <Text numberOfLines={2} style={styles.inputText}>
                {post.title || "같이 운동하실 분 구해요"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>태그</Text>
          {canEdit ? (
            <CreatePostTagSelector
              options={CREATE_POST_TAG_OPTIONS}
              selectedTags={editTags}
              maxSelectable={CREATE_POST_MAX_TAG_SELECTION}
              isExpanded={isTagSelectorExpanded}
              onToggleExpanded={() => setIsTagSelectorExpanded((v) => !v)}
              onToggleTag={handleToggleTag}
            />
          ) : (post.tags ?? []).length > 0 ? (
            <View style={styles.selectedTagRow}>
              {(post.tags ?? []).map((tag) => (
                <View key={tag} style={styles.selectedTagChip}>
                  <Text style={styles.selectedTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>매칭 정보</Text>
          <View style={styles.detailGrid}>
            <CreatePostDetailCard
              icon={
                <Ionicons name="calendar-outline" size={28} color="#111827" />
              }
              label="날짜"
              value={formatCreatePostDayLabel(scheduledStartAt)}
            />
            <CreatePostDetailCard
              icon={<Ionicons name="time-outline" size={28} color="#111827" />}
              label="시간"
              value={formatCreatePostTimeRangeLabel(
                scheduledStartAt,
                scheduledEndAt,
              )}
            />
            <CreatePostDetailCard
              icon={<MatchDifficultyIcon width={28} height={28} />}
              label="난이도"
              value={CREATE_POST_DIFFICULTY_LABELS[post.difficulty]}
            />
            <CreatePostDetailCard
              icon={<MatchRunIcon width={28} height={28} />}
              label="운동 종목"
              value={post.exerciseType}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>장소</Text>
          <CreatePostLocationCard
            location={post.location}
            onMapPress={() =>
              Linking.openURL(
                `https://maps.google.com/maps?q=${encodeURIComponent(post.location)}`,
              )
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.capacityContainer}>
            <View style={styles.capacityHeader}>
              <Ionicons name="person-outline" size={24} color="#111827" />
              <Text style={styles.capacityLabel}>모집 인원</Text>
            </View>
            <View style={styles.capacityCounter}>
              <Text style={styles.capacityValue}>{post.capacity}명</Text>
            </View>
          </View>
        </View>

        {!isOwner && participants.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              참가 인원 {participants.length}/{post.capacity}
            </Text>
            <View style={styles.participantList}>
              {participants.map((participant) => (
                <View key={participant.id} style={styles.participantRow}>
                  <Image
                    source={require("../../../assets/match/Ellipse-12.png")}
                    style={styles.participantImage}
                    contentFit="cover"
                  />
                  <Text numberOfLines={1} style={styles.participantName}>
                    {participant.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>추가 설명</Text>
          {canEdit ? (
            <>
              <TextInput
                value={editMessage}
                onChangeText={setEditMessage}
                placeholder="예: 초보도 환영하고, 1시간 정도 가볍게 같이 뛰실 분 찾아요."
                placeholderTextColor="#8F95A1"
                multiline
                numberOfLines={5}
                maxLength={BIO_MAX_LENGTH}
                style={styles.messageInput}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {editMessage.length}/{BIO_MAX_LENGTH}
              </Text>
            </>
          ) : (
            <View style={styles.messageInputView}>
              <Text style={styles.messageText}>
                {post.message || "작성자가 추가 설명을 입력하지 않았어요."}
              </Text>
            </View>
          )}
        </View>

        {canEdit ? (
          <View style={styles.ownerButtonRow}>
            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.editButton, isSaving && styles.buttonDisabled]}
            >
              <Text style={styles.editButtonText}>
                {isSaving ? "저장 중..." : "수정하기"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>매칭 취소</Text>
            </Pressable>
          </View>
        ) : canApply ? (
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleApply}
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "신청 중..." : "매칭 참여"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.readOnlyFooter}>
            <Ionicons name="eye-outline" size={18} color="#6B7280" />
            <Text style={styles.readOnlyFooterText}>
              읽기 전용 모집글입니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 18,
    backgroundColor: "#FFFFFF",
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
  readOnlyFooter: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  readOnlyFooterText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "800",
  },
  profileCard: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  hostName: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111827",
    fontWeight: "800",
  },
  department: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    fontWeight: "700",
  },
  section: { gap: 8 },
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
  singleLineInputView: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
  },
  selectedTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTagChip: {
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedTagText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  capacityContainer: {
    width: "100%",
    minHeight: 74,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  capacityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  capacityLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
  },
  capacityCounter: {
    minWidth: 88,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  capacityValue: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "700",
  },
  capacityHint: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  participantList: { gap: 10 },
  participantRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
  },
  participantName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
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
  messageInputView: {
    minHeight: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "600",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "right",
  },
  ownerButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  deleteButton: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#EF4444",
    fontWeight: "800",
  },
  submitButton: {
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  submitButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
