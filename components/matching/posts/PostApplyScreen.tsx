import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MatchRunIcon from "@/assets/match/fluent-run-16-filled.svg";
import MatchDifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import { CREATE_POST_DIFFICULTY_LABELS } from "@/components/matching/create-post/createPostConfig";
import CreatePostDetailCard from "@/components/matching/create-post/CreatePostDetailCard";
import CreatePostLocationCard from "@/components/matching/create-post/CreatePostLocationCard";
import {
  formatCreatePostDayLabel,
  formatCreatePostTimeRangeLabel,
} from "@/components/matching/create-post/createPostUtils";
import {
  applyToPost,
  getPostById,
  getPostHostProfile,
  getPostParticipants,
  type PostHostProfile,
  type PostParticipant,
} from "@/services/post/postService";
import type { Post } from "@/types/domain/post";

type PostApplyScreenProps = {
  postId: number;
};

const CURRENT_USER_ID = 99;

const toDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export default function PostApplyScreen({ postId }: PostApplyScreenProps) {
  const [post, setPost] = React.useState<Post | null>(null);
  const [host, setHost] = React.useState<PostHostProfile | null>(null);
  const [participants, setParticipants] = React.useState<PostParticipant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadPost = async () => {
      const nextPost = await getPostById(postId);

      if (!nextPost) {
        if (isMounted) {
          setIsLoading(false);
        }
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
        setIsLoading(false);
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleApply = async () => {
    if (!post) {
      return;
    }

    setIsSubmitting(true);

    try {
      await applyToPost(
        { postId: post.id },
        {
          currentUserId: CURRENT_USER_ID,
          hostUserId: post.hostUserId,
          postStatus: post.status,
          currentParticipantCount: participants.length,
          capacity: post.capacity,
        },
      );

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
  const selectedTags = post.tags ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>

        <Text style={styles.headerTitle}>매칭 참여</Text>
        <View style={styles.headerSpacer} />
      </View>

      {host ? (
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
        <View style={styles.singleLineInput}>
          <Text numberOfLines={2} style={styles.inputText}>
            {post.title || "같이 운동하실 분 구해요"}
          </Text>
        </View>
      </View>

      {selectedTags.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>태그</Text>
          <View style={styles.selectedTagRow}>
            {selectedTags.map((tag) => (
              <View key={tag} style={styles.selectedTagChip}>
                <Text style={styles.selectedTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>매칭 정보</Text>
        <View style={styles.detailGrid}>
          <CreatePostDetailCard
            icon={<Ionicons name="calendar-outline" size={28} color="#111827" />}
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

      {participants.length > 0 ? (
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
        <View style={styles.messageInput}>
          <Text style={styles.messageText}>
            {post.message || "작성자가 추가 설명을 입력하지 않았어요."}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={handleApply}
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "신청 중..." : "매칭 참여"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 28,
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
  headerSpacer: {
    width: 40,
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
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "800",
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
  singleLineInput: {
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
  participantList: {
    gap: 10,
  },
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
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "600",
  },
  submitButton: {
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  submitButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
