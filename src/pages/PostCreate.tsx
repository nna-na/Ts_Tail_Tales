import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    if (title && content) {
      try {
        // JSON 서버에 데이터 추가를 위한 POST 요청 보내기
        const response = await axios.post("http://localhost:4000/posts", {
          title,
          content,
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
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={handleTitleChange}
        />
        <TextArea
          placeholder="내용"
          value={content}
          onChange={handleContentChange}
        />
        <Button type="submit">작성</Button>
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

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;
