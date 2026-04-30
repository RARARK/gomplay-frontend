import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PostCard from "@/components/matching/posts/PostCard";
import { getPosts } from "@/services/post/postService";
import type { Post } from "@/types/domain/post";

const FILTERS = ["종목", "시간", "난이도"] as const;

export default function PostListScreen() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    getPosts()
      .then((nextPosts) => {
        if (isMounted) {
          setPosts(nextPosts);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color="#070322" />
        </Pressable>

        <Text style={styles.title}>추천 매칭 리스트</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filterBar}>
        {FILTERS.map((filter) => (
          <Pressable key={filter} accessibilityRole="button" style={styles.filter}>
            <Text style={styles.filterText}>{filter}</Text>
            <Ionicons name="chevron-down" size={14} color="#4C5BE2" />
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color="#4C5BE2" />
        </View>
      ) : posts.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => router.push(`/posts/${post.id}`)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.stateBox}>
          <Text style={styles.emptyTitle}>등록된 모집글이 없어요</Text>
          <Text style={styles.emptyText}>첫 번째 매치를 모집해보세요.</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/posts/create")}
        style={styles.fab}
      >
        <Ionicons name="pencil" size={18} color="#FFFFFF" />
        <Text style={styles.fabText}>모집하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F7FF",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    position: "relative",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  title: {
    position: "absolute",
    left: 80,
    right: 80,
    fontSize: 20,
    lineHeight: 28,
    color: "#070322",
    fontWeight: "900",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 20,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filter: {
    minHeight: 30,
    minWidth: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
  },
  filterText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#070322",
    fontWeight: "700",
  },
  listContent: {
    gap: 12,
    paddingBottom: 88,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: "#070322",
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5C5A63",
    fontWeight: "600",
  },
});
