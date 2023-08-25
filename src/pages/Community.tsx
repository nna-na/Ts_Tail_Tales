import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

interface Comment {
  id: number;
  content: string;
  userNickname: string;
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
}

export default function Community() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/posts?_embed=comments`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const { data, isLoading, isError, error } = useQuery(
    ["posts", id],
    async () => {
      if (id) {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/posts/${id}`
        );
        return response.data;
      }
    },
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return <div>로딩 중 ...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!posts) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <div>커뮤니티</div>
      <Link to="/create">작성</Link>
      {posts?.map((post) => (
        <PostBox key={post.id}>
          <Link to={`/post-detail/${post.id}`}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>
              {ReactHtmlParser(post.content, {
                transform: (node, index) => {
                  if (node.type === "tag" && node.name === "img") {
                    if (index === 0) {
                      return (
                        <img
                          key={index}
                          {...node.attribs}
                          style={{
                            width: "250px",
                            height: "200px",
                          }}
                        />
                      );
                    } else {
                      return null;
                    }
                  }
                  return undefined;
                },
              })}
            </PostContent>
            <div>{post.author}</div>
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
  max-width: 100%; /* Adjust the maximum width as needed */
  font-size: 1rem;
  color: #333;
  margin-bottom: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CommentBox = styled.div`
  border: 1px solid lightgray;
  padding: 5px;
  margin-top: 5px;
`;

const CommentContent = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const img = styled.img`
  width: 1000px;
  height: 400px;
`;
