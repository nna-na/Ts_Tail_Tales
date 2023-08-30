import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 상태로 게시물 데이터를 관리합니다.
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

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
    <>
      <Title>커뮤니티</Title>
      <Container>
        {" "}
        <PostsGrid>
          {currentPosts?.map((post) => (
            <PostBox key={post.id}>
              <Link
                to={`/post-detail/${post.id}`}
                style={{ textDecoration: "none" }}
              >
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
                <PostTitle>{post.title}</PostTitle>
                <div>{post.author}</div>
              </Link>
            </PostBox>
          ))}
        </PostsGrid>
        <CreateButton to="/create">
          <h5 className="fas fa-plus">작성</h5>
        </CreateButton>
      </Container>
      <PaginationContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(posts.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />
      </PaginationContainer>
    </>
  );
}

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Container = styled.div`
  padding: 20px;
  position: relative; /* 작성 버튼을 위치시키기 위해 부모 요소에 상대 위치 설정 */
  display: flex; /* 이미지를 가운데로 정렬하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 세 개의 컬럼으로 그리드 설정 */
  gap: 40px; /* 컬럼 간의 간격 */
`;

const PostBox = styled.div`
  border: none; /* 테두리 없애기 */
  padding: 10px;
  padding-top: 30px;
  margin-top: 10px;
  width: 450px;
  height: 280px;
  display: flex; /* 이미지를 가운데로 정렬하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3); /* 바텀에만 그림자 추가 */
`;

const CreateButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  background-color: #f8b3b3;
  color: white;
  border-radius: 50%; /* 동그란 모양을 위한 둥근 테두리 설정 */
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

const ImgDiv = styled.div`
  width: 300px;
  height: 250px;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex; /* 이미지를 가운데로 정렬하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  color: black; /* 폰트 색상을 검정색으로 설정 */
`;

const ImageContainer = styled.div`
  max-width: 100%;
  height: 0;
  padding-bottom: ${(250 / 300) * 100}%; /* 이미지 비율에 맞게 조정 */
  position: relative;
  display: flex; /* 이미지를 가운데로 정렬하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  border-radius: 10px; /* 둥근 테두리 추가 */

  & img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    border-radius: 10px; /* 이미지에도 둥근 테두리 추가 */
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

// const Img = styled.img`
// position: absolute;
// width: 100%;
// height: 100%;
// top: 0;
// left: 0;
// object-fit: cover;
// `;
