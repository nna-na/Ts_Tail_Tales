import React, { useState } from "react";
import styled from "styled-components";

const SlideContainer = styled.div`
  display: flex;
  overflow: hidden;
`;

const SlideWrapper = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
`;
const SlideItem = styled.div`
  display: flex;
  /* 슬라이드 아이템의 너비를 조절합니다. */
  width: 10%; /* 아이템의 퍼센트 단위 너비를 설정합니다. */
  margin-right: 20px; /* 슬라이드 아이템 간의 간격을 조절합니다. */
  box-sizing: border-box;
`;

interface SlideProps {
  items: React.ReactNode[];
}

function Slide({ items }: SlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.ceil(items.length / 3) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(items.length / 3) - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      <SlideContainer>
        <SlideWrapper
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {items.map((item, index) => (
            <SlideItem key={index}>{item}</SlideItem>
          ))}
        </SlideWrapper>
      </SlideContainer>
      <button onClick={prevSlide}>이전</button>
      <button onClick={nextSlide}>다음</button>
    </div>
  );
}

export default Slide;
