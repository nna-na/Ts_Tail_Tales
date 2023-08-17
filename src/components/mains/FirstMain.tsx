import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const FirstMain = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h1>
        우리 지역 <br /> 기다리는 친구들 찾기 뭐시깽이
      </h1>
      <span>
        다양한 정보를 찾아보세요
        <br />
        위치 기반 서비스를 바탕으로 <br />
        쉽게 찾아볼수있는 모시깽이 입니다
      </span>
      <br />
      <Button onClick={() => navigate("/home")}>기다리는 친구들</Button>
      <div>
        <IoIosArrowDown />
      </div>
    </Container>
  );
};

export default FirstMain;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 화면의 높이에 맞게 설정 */
`;

const Button = styled.button`
  background-color: #f8b3b3;
  border: none;
  padding: 10px 10px 10px 10px;
`;
