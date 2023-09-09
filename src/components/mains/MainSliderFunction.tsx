import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ThirdMain = () => {
  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".start3",
      start: "top center",
      end: "bottom center",
      animation: gsap.to(".gsap3", {
        x: 100,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
      }),
      toggleActions: "restart reverse restart reverse",
    });
  }, []);

  return (
    <div className="start3 w-screen relative bg-main-color h-screen snap-center">
      <div className="absolute">
        <img className="absolute" src="/image/mains/main19.gif" alt="" />
        <div className="text-container">
          <h2 className="gsap3 opacity-0 font-bold max-sm:text-2xl text-3xl lg:text-4xl leading-loose">
            우동집은 이런 기능이 있어요!
          </h2>
          <div className="gsap3 opacity-0">
            우동집의 다양한 기능들을 알려드립니다.
          </div>
        </div>
        <section className="transLeft thirdLinkSection">
          <div className="gsap3 opacity-0 bg-btn-green-color thirdLink">
            <Link to={"/map"}>
              <img
                src="/image/mains/main7.jpg"
                alt=""
                width="200"
                height="150"
              />
              <div className="thirdLinkText">
                우리 아이가 다닐 어린이집을 찾아봐요!
              </div>
            </Link>
          </div>
          <div className="gsap3 opacity-0 bg-pink-color thirdLink">
            <Link to={"/community"}>
              <img
                src="/image/mains/main8.jpg"
                alt=""
                width="200"
                height="150"
              />
              <div className="thirdLinkText">함께 이야기 나눠봐요!</div>
            </Link>
          </div>
          <div className="gsap3 opacity-0 bg-blue-color thirdLink">
            <Link to={"/aboutus"}>
              <img
                src="main/notification3.png"
                alt=""
                width="200"
                height="150"
              />
              <div className="thirdLinkText">about us</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ThirdMain;
