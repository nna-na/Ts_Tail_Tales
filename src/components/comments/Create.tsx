import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";

interface CreateProps {
  onCommentAdded: () => void;
  postId: string; // postId를 추가
}

export default function Create({ onCommentAdded, postId }: CreateProps) {
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          sessionStorage.setItem("user", JSON.stringify(session.user));
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserNickname(null);
          sessionStorage.removeItem("user");
        }
      }
    );

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
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

  const createCommentMutation = useMutation<
    void,
    Error,
    {
      id: string;
      content: string;
      userNickname: string;
      date: string;
      postId: string;
    } // postId 추가
  >(
    async (newComment) => {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/comments`,
        newComment
      );
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

    if (!content) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const newComment = {
      id: nanoid(),
      postId,
      content,
      userNickname: userNickname || user?.user_metadata.full_name,
      date: new Date().toISOString(),
    };

    try {
      await createCommentMutation.mutateAsync(newComment);
      alert("댓글이 작성되었습니다.");
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  return (
    <CreateContainer>
      <CreateForm onSubmit={handleSubmit}>
        <CreateTextarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
