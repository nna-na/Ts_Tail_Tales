import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
interface PostDetailProps {
  posts: Post[];
}
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
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) {
          throw new Error("삭제가 취소되었습니다.");
        }
      },
      onSuccess: () => {
        // 삭제 성공 후 커뮤니티 페이지로 이동
        navigate("/community");
      },
      onError: (error) => {
        console.error("게시글 삭제 오류:", error);
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
    navigate("/community");
    return null;
  }

  return (
    <Container>
      <h2>디테일 페이지</h2>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      <ButtonContainer>
        <EditButton to={`/post-edit/${data.id}`}>수정</EditButton>
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

const EditButton = styled(Link)`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  text-decoration: none;
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
