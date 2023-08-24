import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";

interface Comment {
  id: number;
  title: string;
  content: string;
  userNickname: string;
  date: string;
}

export default function Edit({ id, userId, onUpdateComplete }: { id: number; userId: number; onUpdateComplete: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = useQuery<Comment>(["comments", id], async () => {
    const response = await axios.get(`http://localhost:4000/comments/${id}`);
    return response.data;
  });

  const updateComment = useMutation<Comment, unknown, Comment>(
    async (updatedComment) => {
      const response = await axios.put(`http://localhost:4000/comments/${id}`, updatedComment);
      return response.data;
    },
    {
      onSuccess: (updatedComment) => {
        queryClient.setQueryData(["comments", id], updatedComment);
        queryClient.invalidateQueries(["comments", id]);
        window.alert("댓글 수정이 완료되었습니다.");
        onUpdateComplete();
        navigate(`/post-detail/${id}`);
      },
    }
  );

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setTitle(initialData.title);
      setUserNickname(initialData.userNickname);
    }
  }, [initialData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !title) {
      window.alert("제목과 내용을 입력해주세요.");
      return;
    }

    const updatedComment: Comment = {
      id: id,
      title,
      content,
      userNickname,
      date: new Date().toISOString(),
    };

    try {
      await updateComment.mutateAsync(updatedComment);
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      return;
    }

    // 수정 완료 후 데이터 다시 불러오기
    queryClient.invalidateQueries(["comments", id]);
    onUpdateComplete();
    navigate(`/post-detail/${id}`);
  };

  if (isLoading) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!initialData) {
    return <ErrorText>댓글을 찾을 수 없습니다.</ErrorText>;
  }

  return (
    <Container>
      <Form onSubmit={handleUpdate}>
        <h2>댓글 수정</h2>
        <FormItem>
          <label>제목:</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <Textarea value={content} onChange={handleContentChange} />
        </FormItem>
        <SubmitButton type="submit">수정 완료</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Textarea = styled.textarea`
  width: 1000px;
  height: 300px;
  padding: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
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
