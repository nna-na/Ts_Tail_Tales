import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import Create from "../components/comments/Create";
import Comment from "../components/comments/Comment";
import { supabase } from "../supabase";
import ReactHtmlParser from "react-html-parser";
import { FiArrowLeft } from "react-icons/fi"; // 이모티콘을 위한 아이콘 라이브러리 import

interface Post {
  id: number;
  title: string;
  content: string;
  userNickname: string;
}

export default function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 게시물 데이터 가져오기
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(["posts", id], async () => {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

    if (error) {
      throw error;
    }

    return data;
  });
  console.log("detailpostid", post);

  // 댓글 목록 가져오기
  const { data: comments, isLoading: isLoadingComments } = useQuery(["comments", id], async () => {
    const { data, error } = await supabase.from("comments").select("*").eq("postId", id).order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  });

  // 게시물 수정 후 댓글 목록 다시 가져오기
  const refreshPostData = async () => {
    await queryClient.invalidateQueries(["comments", id]);
  };

  if (isLoading || isLoadingComments) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!post) {
    navigate("/community");
    return null;
  }

  const isUserAuthorized = post.email === sessionStorage.getItem("userEmail");

  // 게시물 삭제 함수
  const deletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw error;
    }
  };

  // 게시물 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      await deletePost(post.id);
      navigate("/community");
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/community")}>
        <BackIcon />
        뒤로가기
      </BackButton>
      <p>
        <strong>{post.userNickname}</strong>님의 글입니다.
      </p>
      <ButtonContainer>
        {isUserAuthorized && (
          <>
            <EditButton to={`/post-edit/${post.id}`}>수정</EditButton>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
          </>
        )}
      </ButtonContainer>
      <Title>{post.title}</Title>
      <Content>{ReactHtmlParser(post.content)}</Content>

      <Create onCommentAdded={refreshPostData} postId={post.id} />
      <Comment comments={comments} />
    </Container>
  );
}

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #f8b3b3;
    transform: scale(1.05);
  }
`;

const BackIcon = styled(FiArrowLeft)`
  margin-right: 5px;
`;

const Container = styled.div`
  padding: 20px;
  width: 1000px;
  margin: 0 auto; /* 수평 가운데 정렬 */
`;

const Title = styled.h3`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  height: 60px; /* 높이 조정 */
  text-align: center;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0; /* 위 아래 여백 추가 */
`;

const Content = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const EditButton = styled(Link)`
  color: gray;
  margin-right: 5px;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
`;

const DeleteButton = styled.button`
  color: #dd3a3a;
  margin-right: 5px;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
