import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData";
import PetCard from "../components/Petcard";
import { supabase } from "../supabase";
import styled from "styled-components";

function Mypage() {
  const [userEmail, setUserEmail] = useState("");
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 유저 정보 가져오기
    const getUserInfo = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }

      const user = userData?.user;
      const email = user?.email;
      setUserEmail(email || ""); // 이메일을 상태에 저장
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();
        console.log("fetchedData", fetchedData);

        // 데이터가 존재하지 않을 경우에만 API 요청
        if (favoriteAnimals.length === 0) {
          const fetchedData = await fetchAnimalData(); // 데이터 가져오기
          setFavoriteAnimals(fetchedData); // 가져온 데이터를 상태에 설정
        }

        // 사용자의 즐겨찾기 정보 가져오기
        const { data: favoriteData, error: favoriteError } = await supabase
          .from("favorites")
          .select("animalId")
          .eq("email", userEmail);

        if (favoriteError) {
          console.error("사용자 즐겨찾기 항목 가져오기 오류:", favoriteError);
          return;
        }

        const favoriteAnimalIds = favoriteData.map((fav: any) => fav.animalId);

        // 사용자의 즐겨찾기한 동물 정보 필터링
        const favoriteAnimalsWithEmail = fetchedData.filter((item: any) =>
          favoriteAnimalIds.includes(item.ABDM_IDNTFY_NO)
        );

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
    setFavoriteAnimals((prevFavorites) =>
      prevFavorites.filter((item) => item.ABDM_IDNTFY_NO !== animalId)
    );
  };

  return (
    <div className="Mypage">
      <h2>My Page</h2>
      <button
        onClick={() => {
          window.history.back();
        }}
      >
        뒤로가기
      </button>
      <Container>
        {favoriteAnimals?.map((item) => (
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
    </div>
  );
}

export default Mypage;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px;
`;
