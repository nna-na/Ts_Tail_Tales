import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Animal } from "../redux/animalSlice";
// import { selectAnimals } from "../redux/animalSlice";
import axios from "axios";
// import { fetchAnimalsStart, fetchAnimalsSuccess, fetchAnimalsFailure } from "../redux/animalSlice";
import { URL } from "../redux/animalSlice";
import { useQuery } from "react-query";

// interface HomeProps {
//   animals: Animal[];
//   loading: boolean;
//   error: string | null;
// }

function Home() {
  const navigate = useNavigate();

  function formatDate(dateString: string) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // serviceKey: process.env.REACT_APP_API_KEY,
  const {
    data: animals,
    isLoading,
    error,
  } = useQuery("animals", async () => {
    const response = await axios.get(URL, {
      params: {
        serviceKey: process.env.REACT_APP_API_KEY,
        numOfRows: 10,
        pageNo: 10,
      },
    });
    console.log("response", response.data.AbdmAnimalProtect[1].row);
    return response.data.AbdmAnimalProtect[1].row;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!animals) return null;

  return (
    <div className="Home">
      <Container>
        {animals?.map((item: Animal) => (
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
