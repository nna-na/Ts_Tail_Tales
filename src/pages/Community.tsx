import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { supabase } from "../supabase";

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
  const navigate = useNavigate();

  // 상태로 게시물 데이터를 관리합니다.
  const [posts, setPosts] = useState<Post[]>([]);

  // 게시물 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("게시물 가져오기 오류:", error);
      } else {
        setPosts(posts);
      }
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // HTML 내용에서 이미지를 추출하는 함수
  const extractImages = (content: string): string[] => {
    const imgTags = content.match(/<img[^>]+src="([^">]+)"/g);
    if (imgTags) {
      return imgTags.map((tag) => {
        const match = tag.match(/src="([^">]+)"/);
        return match ? match[1] : "";
      });
    }
    return [];
  };

  return (
    <Container>
      <div>커뮤니티</div>
      <Link to="/create">작성</Link>
      {posts?.map((post) => (
        <PostBox key={post.id}>
          <Link to={`/post-detail/${post.id}`}>
            <PostTitle>{post.title}</PostTitle>
            <ImgDiv>
              {/* 이미지가 있을 때만 이미지 표시 */}
              {extractImages(post.content).length > 0 && (
                <ImageContainer>
                  {extractImages(post.content)?.map((imgUrl, index) => (
                    <img src={imgUrl} alt={`Image ${index}`} key={index} />
                  ))}
                </ImageContainer>
              )}
            </ImgDiv>
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

const ImgDiv = styled.div`
  width: 250px; /* 원하는 너비 */
  height: 250px; /* 원하는 높이 */
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  max-width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;

  & img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
  }
`;

// const Img = styled.img`
// position: absolute;
// width: 100%;
// height: 100%;
// top: 0;
// left: 0;
// object-fit: cover;
// `;
