import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData";
import PetCard from "../components/Petcard";
import { supabase } from "../supabase";
import styled from "styled-components";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 3;

function Mypage() {
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentFavoriteAnimals = favoriteAnimals.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // 유저 정보 가져오기
    const getUserInfo = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      // if (userError) {
      //   alert("사용자 정보 가져오는 중 오류 발생");
      //   return;
      // }

      const user = userData?.user;
      const email = user?.email;
      const nickname = user?.user_metadata.name || user?.user_metadata.user_name;
      const avatar = user?.user_metadata.avatar_url;

      setUserEmail(email || ""); // 이메일을 상태에 저장
      setUserNickname(nickname || "");
      setUserAvatar(avatar || "");
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();

        // 데이터가 존재하지 않을 경우에만 API 요청
        if (favoriteAnimals.length === 0) {
          const fetchedData = await fetchAnimalData(); // 데이터 가져오기
          setFavoriteAnimals(fetchedData); // 가져온 데이터를 상태에 설정
        }

        // 사용자의 즐겨찾기 정보 가져오기
        const { data: favoriteData, error: favoriteError } = await supabase.from("favorites").select("animalId").eq("email", userEmail);

        if (favoriteError) {
          alert("사용자 즐겨찾기 항목 가져오기 오류");
          return;
        }

        const favoriteAnimalIds = favoriteData.map((fav: any) => fav.animalId);

        // 사용자의 즐겨찾기한 동물 정보 필터링
        const favoriteAnimalsWithEmail = fetchedData.filter((item: any) => favoriteAnimalIds.includes(item.ABDM_IDNTFY_NO));

        setFavoriteAnimals(favoriteAnimalsWithEmail);
      } catch (e: Error | unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An error occurred"));
        }
      }
      setLoading(false);
    };

    if (userEmail) {
      fetchDataFromApi();
    }
  }, [userEmail]);

  const removeFavorite = (animalId: string) => {
    setFavoriteAnimals((prevFavorites) => prevFavorites.filter((item) => item.ABDM_IDNTFY_NO !== animalId));
  };

  return (
    <MyPage>
      <StDetailText>
        <BackIcon
          className="backBtn"
          onClick={() => {
            navigate("/home");
          }}
        >
          〈
        </BackIcon>
        <h2 className="detailtext">My page</h2>
      </StDetailText>
      <ContentContainer>
        <LeftContent>
          {/* 좌측 컨텐츠 */}
          <h3>Your Profile</h3>
          <AvatarImage src={userAvatar || process.env.PUBLIC_URL + "/image/header/profile.jpg"} alt="User Avatar" />
          <h4>{userNickname}님, 반가워요!</h4>
        </LeftContent>
        <RightContent>
          {/* 우측 컨텐츠 */}
          <h3>{userNickname}님 관심 가져주셔서 감사해요!</h3>
          {!loading ? (
            <Container>
              {currentFavoriteAnimals?.map((item) => (
                <PetCard
                  key={item.ABDM_IDNTFY_NO}
                  item={item}
                  onRemoveFavorite={() => {
                    if (item.ABDM_IDNTFY_NO) {
                      removeFavorite(item.ABDM_IDNTFY_NO);
                    }
                  }}
                />
              ))}
            </Container>
          ) : (
            <p>Loading...</p>
          )}
          {!loading && <Pagination currentPage={currentPage} totalPages={Math.ceil(favoriteAnimals.length / ITEMS_PER_PAGE)} setCurrentPage={handlePageChange} />}
        </RightContent>
      </ContentContainer>
    </MyPage>
  );
}

export default Mypage;

const StDetailText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  margin-top: 50px;
  .backBtn {
    background: none;
    border: none;
    color: black;
    margin-right: 5px;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
      color: #868686;
    }
  }
  .detailtext {
    margin: 0 auto;
    text-align: center;
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #868686;
  }
`;

const MyPage = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  margin: 0 auto; /* 수평 가운데 정렬 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: flex-start; /* 위쪽 정렬 */
  height: 600px;
`;

const LeftContent = styled.div`
  width: 25%;
  height: 100%;
  background-color: #746464;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* background-image: url("/image/mypage/mypage01.jpg");
  background-size: cover; */

  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;

    border-radius: 20px;
    background: #746464;

    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  h4 {
    color: white;
  }
`;

const RightContent = styled.div`
  width: 75%;
  height: 100%;
  background-color: #fdfaf6;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 20px;
    background: #746464;

    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const Container = styled.div`
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  padding-right: 65px;
  gap: 20px;
`;

const AvatarImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 20px;
`;
