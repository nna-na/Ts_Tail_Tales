import React from "react";
import { styled } from "styled-components";

function SecondMain() {
  return (
    <Container>
      <h1>
        함께 나누고 <br /> 도움을 줄 수 있는 입양 사이트 뭐시깽이
      </h1>
      <span>지역 내 많은 보호소 중 가깝고, 확실한 정보를 제공합니다.</span>
      <br />
      <div>
        <Img
          src="https://i.pinimg.com/564x/28/d8/d2/28d8d2bdfcdd2a8c394e212dc0d1910a.jpg"
          alt=""
        />
        <Space />
        <Img
          src="https://i.pinimg.com/564x/95/7b/28/957b28e7580bc621489abad533406b35.jpg"
          alt=""
        />
        <Space />
        <Img
          src="https://i.pinimg.com/564x/f9/9b/ee/f99bee1eabea25abe9e34f5cc2f2d427.jpg"
          alt=""
        />
        <Space />
        <Img
          src="https://i.pinimg.com/564x/85/d3/63/85d363f4a4f2ed8bbc83ce698159ff09.jpg"
          alt=""
        />
      </div>
    </Container>
  );
}

export default SecondMain;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 화면의 높이에 맞게 설정 */
  background-color: #f0f0f0;
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
`;

const Space = styled.span`
  padding-left: 5px;
  padding-right: 5px;
`;
