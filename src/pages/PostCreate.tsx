import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"; // uuid 패키지에서 v4 함수 임포트
import { supabase } from "../supabase";
import PostImg from "../components/posts/PostImg";
import { FiArrowLeft } from "react-icons/fi";

export default function PostCreate() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const navigate = useNavigate();
  // 사용자 정보 가져오기
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userNickname = user ? user.user_metadata.user_name || user.user_metadata.full_name : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      const { error } = await supabase.from("posts").insert([
        {
          id: uuid(),
          title,
          content,
          date: new Date().toISOString(),
          userNickname: userNickname,
          email: user?.email,
        },
      ]);

      if (error) {
        console.error("게시글 작성 오류:", error);
        return;
      }
      alert("작성이 완료되었습니다.");
      navigate("/community");
      // 입력 필드 초기화
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <Container>
      <StDetailText style={{ display: "flex", alignItems: "center" }}>
        <BackIcon
          className="backBtn"
          onClick={() => {
            navigate("/community");
          }}
        >
          〈
        </BackIcon>
        <h2 className="detailtext">게시글 작성</h2>
      </StDetailText>
      <Form onSubmit={handleSubmit}>
        <FormItem>
          <label>제목:</label>
          <Input type="text" value={title} onChange={handleTitleChange} placeholder="제목" />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <PostImg onContentChange={handleContentChange} initialContent={content} />
        </FormItem>
        <SubmitButton type="submit">작성</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  width: 1000px;
  margin: 0 auto;
  background-color: #fdfaf6;
`;
const StDetailText = styled.div`
  // margin-top: 30px;
  padding-left: 20px;
  color: black;
  .backBtn {
    background: none;
    border: none;
    color: black;
  }
  .detailtext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px 0 20px;
  }

  strong {
    color: #746464;
  }
`;
const BackIcon = styled.span`
  margin-right: 5px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
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
  width: 978px;
  padding: 20px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;
