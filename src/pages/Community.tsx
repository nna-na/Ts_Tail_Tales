import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  date: string;
}

export default function Community() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [posts, setPosts] = useState<Post[]>([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase.from("posts").select("*").order("date", { ascending: false });

      if (error) {
        alert("게시물 가져오기 오류");
      } else {
        setPosts(posts);
      }
    } catch (error) {
      alert("게시물 가져오기 오류");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}") as { email: string } | null;

  return (
    <>
      <Title>커뮤니티</Title>
      <Container>
        <PostsList>
          {currentPosts?.map((post, index) => (
            <PostItem key={post.id}>
              <PostNumber>{index + 1}</PostNumber>
              <PostContent>
                <Link to={`/post-detail/${post.id}`} style={{ textDecoration: "none" }}>
                  <PostTitle>{post.title}</PostTitle>
                </Link>
                <PostInfo>
                  <div>{post.author}</div>
                  <div>{post.date}</div>
                </PostInfo>
              </PostContent>
            </PostItem>
          ))}
        </PostsList>
        {user?.email && (
          <CreateButton to="/create">
            <CreateBtn className="fas fa-plus">작성하기</CreateBtn>
          </CreateButton>
        )}
      </Container>
      <PaginationContainer>
        <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / itemsPerPage)} setCurrentPage={setCurrentPage} />
      </PaginationContainer>
    </>
  );
}

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 50px;
`;

const Container = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const PostItem = styled.div`
  display: flex;
  align-items: center;
`;

const PostNumber = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 10px;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #777;
`;

const CreateButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  background-color: #746464;
  color: white;
  border-radius: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;

const CreateBtn = styled.h2`
  font-size: 15px;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;
