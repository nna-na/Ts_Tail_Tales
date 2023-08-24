import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { User } from "@supabase/supabase-js"; // User 타입 가져오기
import { supabase } from "../../supabase";

interface CreateProps {
  onCommentAdded: () => void;
}

export default function Create({ onCommentAdded }: CreateProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null); // 사용자 정보 상태
  const [userNickname, setUserNickname] = useState<string | null>(null); // 사용자 닉네임 상태
  const queryClient = useQueryClient();

  // 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 로그인/로그아웃 이벤트 핸들링
  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        sessionStorage.setItem("user", JSON.stringify(session.user));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserNickname(null);
        sessionStorage.removeItem("user");
      }
    });

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  // 사용자 정보 설정
  useEffect(() => {
    if (user) {
      setUserNickname(user.user_metadata.user_name); // 사용자 닉네임 설정
      sessionStorage.setItem("userNickname", user.user_metadata.user_name); // 세션 스토리지에 사용자 닉네임 저장
    }
  }, [user]); // user 상태가 변경될 때마다 실행

  const createCommentMutation = useMutation<void, Error, { title: string; content: string }>(
    async (newComment) => {
      await axios.post("http://localhost:4000/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title && !content) {
      window.alert("제목과 내용을 입력해주세요.");
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

    const newComment = {
      id: nanoid(),
      title,
      content,
      userNickname: userNickname || user?.user_metadata.full_name,
      date: new Date().toISOString(),
    };

    try {
      await createCommentMutation.mutateAsync(newComment);
      alert("댓글이 작성되었습니다.");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  return (
    <CreateContainer>
      <CreateForm onSubmit={handleSubmit}>
        <CreateInput placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        <CreateTextarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
        <CreateButton type="submit">작성</CreateButton>
      </CreateForm>
    </CreateContainer>
  );
}

const CreateContainer = styled.div`
  padding: 20px;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CreateInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const CreateTextarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  margin-bottom: 10px;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;
