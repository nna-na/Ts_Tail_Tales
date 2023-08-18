import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom"; // 수정: useHistory 대신 useNavigate 사용
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";

function Home() {
  const navigate = useNavigate(); // 수정: useHistory 대신 useNavigate 사용
  const [data, setData] = useState<Array<AnimalShelter> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setData(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();
        setData(fetchedData);
      } catch (e: any) {
        setError(e);
      }
      setLoading(false);
    };

    fetchDataFromApi();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!data) return null;

  return (
    <div className="Home">
      <button onClick={() => navigate("/")}>뒤로가기</button>
      <Container>
        {data.map((item: AnimalShelter) => (
          <Box key={item.ABDM_IDNTFY_NO} onClick={() => navigate(`/detail/${item.ABDM_IDNTFY_NO}`, { state: { item } })}>
            <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
            <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
            <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
            <p>품종 : {item.SPECIES_NM}</p>
            <p>성별 : {item.SEX_NM}</p>
            <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
            <p>특징: {item.SFETR_INFO}</p>
            <p>상태: {item.STATE_NM}</p>
          </Box>
        ))}
      </Container>
    </div>
  );
}

export default Home;

// 스타일 컴포넌트를 사용한 스타일 정의
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px;
`;

const Box = styled.div`
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 calc(33.33% - 10px);
  box-sizing: border-box;
`;

const PetImg = styled.img`
  width: 400px;
  height: 250px;
  object-fit: contain;
`;
