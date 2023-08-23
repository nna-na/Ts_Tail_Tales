import React from "react";
import { useParams } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostDetailProps {
  posts: Post[];
}

export default function PostDetail({ posts }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();

  const selectedPost = posts.find((post) => post.id === Number(id));

  if (!selectedPost) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h2>게시글 디테일</h2>
      <h3>{selectedPost.title}</h3>
      <p>{selectedPost.content}</p>
    </div>
  );
}
