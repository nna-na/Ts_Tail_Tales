import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { User } from "@supabase/supabase-js"; // User 타입 가져오기
import { supabase } from "../supabase";
import PostImg from "../components/posts/PostImg";

export default function PostCreate() {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 세션 스토리지에서 사용자 정보 가져오기
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);

      // 여기에서 사용자 닉네임을 가져오는 API 호출 또는 Supabase에서 사용자 정보를 추가로 가져올 수 있습니다.
      // 예를 들어, 사용자 닉네임을 가져오는 API 호출 예제:
      // axios.get(`${process.env.REACT_APP_SERVER_URL}/getUserNickname?id=${user.id}`)
      //   .then((response) => {
      //     const nickname = response.data.nickname;
      //     setUserNickname(nickname);
      //   })
      //   .catch((error) => {
      //     console.error("사용자 닉네임 가져오기 오류:", error);
      //   });
    }
  }, []);
  useEffect(() => {
    if (user) {
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
      sessionStorage.setItem(
        "userNickname",
        user.user_metadata.user_name || user.user_metadata.full_name
      );
    }
  }, [user]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // PostImg 컴포넌트로부터 에디터 내용 변경 시 실행되는 함수
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
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
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/posts`,
        {
          id: nanoid(),
          title,
          content,
          date: new Date().toISOString(),
          userNickname: userNickname, // 사용자 닉네임 추가
        }
      );

      const postId = response.data.id; // 새로 생성된 게시물의 ID 저장
      console.log("게시글 작성 결과:", response.data);
      window.alert("작성이 완료되었습니다.");
      navigate("/community");
      console.log("postid", postId);

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
          {/* <Textarea value={content} onChange={handleContentChange} /> */}
          <PostImg onContentChange={handleContentChange} />
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

// const Textarea = styled.textarea`
//   width: 1000px;
//   height: 300px;
//   padding: 10px;
//   margin-bottom: 10px;
// `;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;
