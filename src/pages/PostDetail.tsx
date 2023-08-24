import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";
import Create from "../components/comments/Create";
import Comment from "../components/comments/Comment"; // 수정된 Comment 컴포넌트 임포트
import ReactHtmlParser from "react-html-parser";

interface Post {
  id: number;
  title: string;
  content: string;
  userNickname: string; // 게시물 작성자 닉네임 추가
}

export default function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(["posts", id], async () => {
    const response = await axios?.get(
      `${process.env.REACT_APP_SERVER_URL}/posts/${id}`
    );
    return response.data;
  });

  // Fetch 댓글 목록
  const { data: comments, isLoading: isLoadingComments } = useQuery(
    ["comments", id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/comments?postId=${id}`
      );
      return response.data;
    }
  );

  const deletePost = useMutation(
    async () => {
      await axios?.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`);
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

  // 수정 성공 후 댓글 목록 다시 가져오기
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

  // 사용자 닉네임과 게시물 작성자 닉네임 비교
  const isUserAuthorized =
    post.userNickname === sessionStorage.getItem("userNickname");

  return (
    <Container>
      <h2>디테일 페이지</h2>
      <p>{post.userNickname}님의 글입니다.</p>
      <h3>{post.title}</h3>
      {/* <p>{post.content}</p> */}
      {ReactHtmlParser(post.content)} {/* post.content를 그대로 출력 */}
      <ButtonContainer>
        {isUserAuthorized && (
          <>
            <EditButton to={`/post-edit/${post.id}`}>수정</EditButton>
            <DeleteButton onClick={() => deletePost.mutate()}>
              삭제
            </DeleteButton>
          </>
        )}
      </ButtonContainer>
      <p>댓글</p>
      <Create onCommentAdded={refreshPostData} postId={post.id} />
      {/* 댓글 목록을 Comment 컴포넌트에 전달합니다 */}
      <Comment comments={comments} /> {/* 댓글 목록을 전달 */}
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
