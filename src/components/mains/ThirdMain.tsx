import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router";
import { styled } from "styled-components";

function ThirdMain() {
  const navigate = useNavigate();

  return (
    <Container>
      <h1>우리는 이런 기능들이 있당께롱</h1>
      <ImageContainer>
        <div>
          <Img
            src="https://i.pinimg.com/564x/28/d8/d2/28d8d2bdfcdd2a8c394e212dc0d1910a.jpg"
            alt="기다리는 친구들"
            onClick={() => navigate("/home")}
          />
          <p>기다리는 친구들</p>
        </div>
        <Space />
        <div>
          <Img
            src="https://i.pinimg.com/564x/95/7b/28/957b28e7580bc621489abad533406b35.jpg"
            alt="커뮤니티"
            onClick={() => navigate("/community")}
          />
          <p>커뮤니티</p>
        </div>
        <Space />
        <div>
          <Img
            src="https://i.pinimg.com/564x/f9/9b/ee/f99bee1eabea25abe9e34f5cc2f2d427.jpg"
            alt="about us"
            onClick={() => navigate("/aboutus")}
          />
          <p>about us</p>
        </div>
      </ImageContainer>
    </Container>
  );
}

export default ThirdMain;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 화면의 높이에 맞게 설정 */
  background-color: #f0f0f0;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
`;

const Space = styled.span`
  padding-left: 50px;
  padding-right: 50px;
`;
