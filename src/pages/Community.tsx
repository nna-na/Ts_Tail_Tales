import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Community() {
  // const queryClient = useQueryClient();
  // const { id } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
  //   const response = await axios.get(`http://localhost:4000/posts/${id}`);
  //   return response.data;
  // });
  // console.log(data);

  // 삭제 버튼
  // const deletePost = useMutation(
  //   async (post) => {
  //     await axios.delete(`http://localhost:3001/posts/${post}`);
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("posts");
  //     },
  //   }
  // );

  return (
    <Container>
      <div>Community</div>
      <Link to="/create">작성</Link>
      {posts.map((post) => (
        <PostBox key={post.id}>
          <Link to={`/post-detail/${post.id}`}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
            <button>수정</button>
            {/* <button
              onClick={() => {
                alert("삭제??");
                deletePost.mutate();
              }}
            >
              삭제
            </button> */}
          </Link>
        </PostBox>
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const PostBox = styled.div`
  border: 1px solid gray;
  padding: 10px;
  margin-top: 10px;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const PostContent = styled.p`
  font-size: 1rem;
  color: #333;
`;
