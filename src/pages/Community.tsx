import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Community() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios?.get("http://localhost:4000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const { data, isLoading, isError, error } = useQuery(
    ["posts", id],
    async () => {
      if (id) {
        const response = await axios?.get(`http://localhost:4000/posts/${id}`);
        return response.data;
      }
    },
    {
      enabled: !!id, // id가 유효한 경우에만 활성화
    }
  );

  //삭제 버튼
  const deletePost = useMutation(
    async (post: any) => {
      await axios?.delete(`http://localhost:4000/posts/${post.id}`);
    },
    {
      onMutate: async (post) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) {
          throw new Error("삭제가 취소되었습니다.");
        }
        // 현재 삭제 중인 포스트 데이터를 임시로 저장
        const originalPost = queryClient.getQueryData(["posts", id]);

        // 포스트 목록 캐시에서 삭제하려는 포스트를 제거
        queryClient.setQueryData(["posts", id], (prevPosts: Post[] | undefined) => {
          if (prevPosts) {
            return prevPosts.filter((p) => p.id !== post.id);
          }
          return [];
        });

        // 반환하여 적절한 시기에 캐시를 롤백
        return { originalPost };
      },
      onError: (error, post, context: any) => {
        // 실패 시 롤백하여 이전 포스트 데이터로 복원
        if (context?.originalPost) {
          queryClient.setQueryData(["posts", id], context.originalPost);
        }
      },
      onSuccess: () => {
        // 포스트 목록 캐시 무효화 (선택적으로 사용)
        queryClient.invalidateQueries(["posts", id]);
        // 삭제 성공 후 커뮤니티 페이지로 이동
        window.location.reload();
      },
    }
  );

  return (
    <Container>
      <div>Community</div>
      <Link to="/create">작성</Link>
      {posts.map((post) => (
        <PostBox key={post.id}>
          <Link to={`/post-detail/${post.id}`}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
          </Link>
          <Link to={`/post-edit/${post.id}`}>수정</Link>
          <button onClick={() => deletePost.mutate(post)}>삭제</button>
        </PostBox>
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const PostBox = styled.div`
  border: 1px solid gray;
  padding: 10px;
  margin-top: 10px;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const PostContent = styled.p`
  font-size: 1rem;
  color: #333;
`;
