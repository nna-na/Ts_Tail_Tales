import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";

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
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
    const response = await axios?.get(`http://localhost:4000/posts/${id}`);
    return response.data;
  });

  const deletePost = useMutation(
    async () => {
      await axios?.delete(`http://localhost:4000/posts/${id}`);
    },
    {
      onMutate: async () => {
        // 데이터 삭제 전에 로딩 상태를 갱신하고, 쿼리를 무효화하지 않도록 한다.
        await queryClient.cancelQueries(["posts", id]);
      },
      onSuccess: () => {
        navigate("/community");
        alert("게시글이 삭제되었습니다.");
      },
    }
  );

  if (isLoading) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!data) {
    // 데이터가 없을 경우 커뮤니티 페이지로 이동
    navigate("/community");
    return null;
  }

  return (
    <Container>
      <h2>디테일 페이지</h2>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      <ButtonContainer>
        <Link to={`/post-edit/${data.id}`}>
          <EditButton>수정</EditButton>
        </Link>
        <DeleteButton onClick={() => deletePost.mutate()}>삭제</DeleteButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
