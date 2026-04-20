import type { Post } from "@/types/domain/post";

export async function getPosts(): Promise<Post[]> {
  return [];
}

export async function getPostById(postId: number): Promise<Post | null> {
  return null;
}

export async function createPost(
  input: Partial<Post>,
): Promise<{ postId: number; status: string }> {
  return {
    postId: 301,
    status: "OPEN",
  };
}

export async function applyToPost(
  postId: number,
  message?: string,
): Promise<{ applicationId: number; status: string }> {
  return {
    applicationId: 101,
    status: "PENDING",
  };
}
