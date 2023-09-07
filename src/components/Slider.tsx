import React from "react";
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

function CustomSlider({ items }: CustomSliderProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4500,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
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

const StyledSliderContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

const StyledSlider = styled(Slider)`
  .slick-slide > div {
    width: 300%;
    box-sizing: border-box;
    max-width: 1000px;
  }

  .slick-prev {
    left: -40px;
    z-index: 1;
  }

  .slick-next {
    right: -40px;
    z-index: 1;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 30px;
    line-height: 1;
    color: #746464;
    transition: all 0.3s ease;
  }

  .slick-prev.slick-disabled:before,
  .slick-next.slick-disabled:before {
    color: gray;
  }
`;
