import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const FirstMain = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ImageContainer>
        <ImageBackground src="/image/main/main1.png" alt="강아지 사진1" />
        <TextWrap>
          <h1>
            유기견, 유기묘들에게 <br /> 새로운 삶을 선물해주세요
          </h1>
          <span>
            다양한 친구들을 만나보세요
            <br />
            지도 상에서 가까운 보호소를 찾아
            <br />
            유기동물을 입양하세요
          </span>
        </TextWrap>
      </ImageContainer>
      <Button onClick={() => navigate("/home")}>기다리는 친구들</Button>
      <DownArrow>
        <IoIosArrowDown />
      </DownArrow>
    </Container>
  );
};

export default FirstMain;

const TextWrap = styled.div`
  color: white;
  text-align: center;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2; /* 텍스트를 더 위에 표시하기 위해 z-index를 높입니다. */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
  position: relative;
`;

const ImageContainer = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
`;

const ImageBackground = styled.img`
  background-image: url("/image/main/main1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  z-index: 1; /* 이미지를 다른 요소 위에 놓습니다. */
`;

const Button = styled.button`
  width: 130px;
  height: 50px;
  background-color: #746464;
  color: #fdfaf6;
  border: none;
  padding: 10px 10px 10px 10px;
  border-radius: 30px;
  cursor: pointer;
  z-index: 2; /* 버튼을 더 위에 표시하기 위해 z-index를 높입니다. */
  position: absolute; /* 버튼의 위치를 조정하기 위해 position을 추가합니다. */
  bottom: 250px; /* 아래 여백을 조정합니다. */
  left: 50%;
  transform: translateX(-50%);
`;

const DownArrow = styled.div`
  color: white;
  position: absolute;
  bottom: 150px; /* 아래 여백을 조정합니다. */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2; /* 화살표를 더 위에 표시하기 위해 z-index를 높입니다. */
`;
