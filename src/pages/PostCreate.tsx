import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export default function PostCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      window.alert("제목을 입력해주세요, 내용을 입력해주세요.");
      return;
    }
    if (!title) {
      window.alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    try {
      // JSON 서버에 데이터 추가를 위한 POST 요청 보내기
      const response = await axios.post("http://localhost:4000/posts", {
        id: nanoid(),
        title,
        content,
        date: new Date().toISOString(),
      });

      console.log("게시글 작성 결과:", response.data);
      window.alert("작성이 완료되었습니다.");
      navigate("/community");

      // 이후 필요한 동작을 수행하십시오.
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>게시글 작성</h2>
        <FormItem>
          <label>제목:</label>
          <Input type="text" value={title} onChange={handleTitleChange} />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <Textarea value={content} onChange={handleContentChange} />
        </FormItem>
        <SubmitButton type="submit">작성</SubmitButton>
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

const Input = styled.input`
  width: 1000px;
  padding: 10px;
  margin-bottom: 10px;
`;

const Textarea = styled.textarea`
  width: 1000px;
  height: 300px;
  padding: 10px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;
