import React from "react";
import { FullPage, Slide } from "react-full-page";
import FirstMain from "../components/mains/FirstMain";
import SecondMain from "../components/mains/SecondMain";
import ThirdMain from "../components/mains/ThirdMain";
import MainFooter from "../components/mains/MainFooter";
import "../styles/style.main.css";

function Main() {
  return (
    <FullPage controls controlsProps={{ className: "slide-navigation" }}>
      <Slide>
        <FirstMain />
      </Slide>
      <Slide>
        <SecondMain />
      </Slide>
      <Slide>
        <ThirdMain />
      </Slide>
      <Slide>
        <MainFooter />
      </Slide>
    </FullPage>

  );
}

export default Main;
