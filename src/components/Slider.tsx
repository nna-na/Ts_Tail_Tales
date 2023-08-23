// CustomSlider.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalShelter } from "../api/fetchData"; // AnimalShelter 또는 실제 데이터 타입에 맞게 import 해주세요.
import styled from "styled-components"; // styled-components를 import 해주세요.

interface CustomSliderProps {
  items: Array<AnimalShelter>;
}

function CustomSlider({ items }: CustomSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <Slider {...settings}>
      {items.map(
        (
          item: AnimalShelter // 'nearingDeadline' 대신 'items'를 사용합니다.
        ) => (
          <Box key={item.ABDM_IDNTFY_NO}>
            <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
            <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
            <p>접수 일지 : {item.RECEPT_DE}</p>{" "}
            {/* 'formatDate' 함수를 사용하지 않습니다. */}
            <p>품종 : {item.SPECIES_NM}</p>
            <p>성별 : {item.SEX_NM}</p>
            <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
            <p>특징: {item.SFETR_INFO}</p>
            <p>상태: {item.STATE_NM}</p>
            <p>보호 주소:{item.SIGUN_NM} </p>
          </Box>
        )
      )}
    </Slider>
  );
}

export default CustomSlider;

const Box = styled.div`
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 calc(33.33% - 10px);
  box-sizing: border-box;
`;

const PetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 400px;
`;
