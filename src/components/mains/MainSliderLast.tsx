import React from "react";
import styled from "styled-components";

function MainSliderLast() {
  return (
    <>
      <Container />
      <Content>
        <Text>기다리는 친구들</Text>
        <Text>커뮤니티</Text>
      </Content>
    </>
  );
}

export default MainSliderLast;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 5vh;
  background: linear-gradient(to bottom, #4d5441, rgba(116, 100, 100, 0));
  border-radius: 0 0 50px 50px;
`;

const Content = styled.div`
  padding: 20px;
`;

const Text = styled.p`
  font-weight: bold;
  color: #333;
`;
