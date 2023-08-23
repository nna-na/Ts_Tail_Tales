import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostDetailProps {
  posts: Post[];
}

export default function PostDetail({ posts }: PostDetailProps) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery(
    ["posts", id],
    async () => {
      const response = await axios.get(`http://localhost:4000/posts/${id}`);
      return response.data;
    }
  );
  console.log("data", data);

  // const selectedPost = posts.find((post) => post.id === Number(id));
  // console.log("디테일", selectedPost);

  // if (isLoading) {
  //   return <div>로딩 중 ...</div>;
  // }
  // if (isError) {
  //   return <div>{error.message}</div>;
  // }
  // if (!data) {
  //   return <div>게시물을 찾을 수 없습니다.</div>;
  // }
  return (
    <div>
      <h2>게시글 디테일</h2>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  );
}
