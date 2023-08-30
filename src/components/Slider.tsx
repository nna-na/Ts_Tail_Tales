import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalShelter } from "../api/fetchData";
import styled from "styled-components";
import PetCard from "./Petcard";
import { FavoritesProvider } from "./FavoritesContext";

interface CustomSliderProps {
  items: Array<AnimalShelter>;
}

const StyledSliderContainer = styled.div`
  /* width: 100%; 컨테이너의 너비를 설정하세요 */
  /* display: flex; */
  /* justify-content: center; */
  margin-left: 50px;
`;

const StyledSlider = styled(Slider)`
  .slick-slide > div {
    width: 250%;
    padding: 10px;
    margin-bottom: 50px;
    box-sizing: border-box;
    max-width: 1000px;
  }
`;

function CustomSlider({ items }: CustomSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true, // autoplay 활성화
    autoplaySpeed: 4500, // 각 슬라이드 간의 넘어가는 시간 설정 (밀리초 단위)
    responsive: [
      {
        breakpoint: 1000, // 화면 폭이 1000px 이하일 때 적용
        settings: {
          slidesToShow: 3, // 더 작은 화면에서는 3개의 아이템을 보여줌
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <FavoritesProvider>
    <StyledSliderContainer>
      <StyledSlider {...settings}>
        {items?.map((item: AnimalShelter) => (
          <div key={item.ABDM_IDNTFY_NO}>
            <PetCard item={item} />
          </div>
        ))}
      </StyledSlider>
     </StyledSliderContainer>
    </FavoritesProvider>
  );
}

export default CustomSlider;
