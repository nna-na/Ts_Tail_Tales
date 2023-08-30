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

const StyledSlider = styled(Slider)`
  .slick-slide > div {
    width: 300%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
`;

function CustomSlider({ items }: CustomSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <FavoritesProvider>
      <StyledSlider {...settings}>
        {items?.map((item: AnimalShelter) => (
          <div key={item.ABDM_IDNTFY_NO}>
            <PetCard item={item} />
          </div>
        ))}
      </StyledSlider>
    </FavoritesProvider>
  );
}

export default CustomSlider;
