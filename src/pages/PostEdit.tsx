import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import PostImg from "../components/posts/PostImg";
import { supabase } from "../supabase";
import { FiArrowLeft } from "react-icons/fi";

export default function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery(
    ["posts", id],
    async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    }
  );

  const handleAddNewPost = useMutation(
    async (updatedData) => {
      await supabase.from("posts").upsert([updatedData]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", id]);
        navigate(`/post-detail/${id}`);
      },
    }
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data?.content);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      alert("제목을 입력해주세요, 내용을 입력해주세요.");
      return;
    }
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userEmail = user?.email;

    if (!userEmail) {
      console.error("사용자 이메일이 없습니다.");
      return;
    }
    const userNickname = sessionStorage.getItem("userNickname"); // Get userNickname from sessionStorage
    if (data.email !== userEmail) {
      alert("자신의 게시물만 수정할 수 있습니다.");
      return;
    }
    const isConfirmed = window.confirm("정말로 수정하시겠습니까?");

    if (isConfirmed) {
      const updatedPost: any = {
        id: data.id,
        title,
        content,
        date: data.date || new Date().toISOString(),
        userNickname,
        email: userEmail,
      };
      handleAddNewPost.mutate(updatedPost);
    }

    if (isLoading) {
      return <LoadingText>로딩 중 ...</LoadingText>;
    }
    if (isError) {
      return <ErrorText>{(error as Error).message}</ErrorText>;
    }
    if (!data) {
      return <ErrorText>게시물을 찾을 수 없습니다.</ErrorText>;
    }
  };

  const handleGoBack = async () => {
    if (window.confirm("이전으로 가면 수정 내용이 사라집니다.")) {
      navigate(`/post-detail/${id}`);
    }
  };

  return (
    <OuterContainer>
      <Container>
        <h2 className="detailtext">게시글 수정</h2>
        <Form onSubmit={handleUpdate}>
          <FormItem>
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목을 입력해주세요"
            />
          </FormItem>
          <FormItem>
            <PostImg
              onContentChange={handleContentChange}
              initialContent={data.content}
            />
          </FormItem>
          <FormButtons>
            <SubmitButton
              type="button"
              className="backbtn"
              onClick={handleGoBack}
            >
              이전
            </SubmitButton>
            <SubmitButton type="submit" className="submitbtn">
              수정
            </SubmitButton>
          </FormButtons>
        </Form>
      </Container>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  background-color: #fdfaf6;
  display: flex;
  justify-content: center;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Container = styled.div`
  padding: 100px;
  margin: 0 auto;
  background-color: #fdfaf6;

  h2 {
    text-align: center;
    margin-bottom: 40px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 1000px;
`;
const Input = styled.input`
  width: 978px;
  height: 30px;
  padding: 15px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: large;
`;
const SubmitButton = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  width: 192px;
  height: 44px;
  padding: 8px;
  border-radius: 999px;
  background: #746464;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

  ${(props) =>
    props.className === "backbtn"
      ? "background: #bdb7b0;"
      : "background: #746464;"}

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;
const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;
const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
