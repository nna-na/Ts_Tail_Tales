import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <TopButton onClick={scrollToTop}>
          <TopContent>
            <TopText>Top</TopText>
          </TopContent>
        </TopButton>
      )}
    </>
  );
};

const TopButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 1002px;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("/image/layout/paws.png") no-repeat center center;
  background-size: 100% auto;
  width: 50px;
  height: 50px;
`;

const TopText = styled.span`
  padding-top: 25px;
  font-size: 14px;
`;

export default ScrollToTop;
