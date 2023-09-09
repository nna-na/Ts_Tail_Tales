import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

gsap.registerPlugin(ScrollTrigger);

interface BabyImage {
  src: string;
  alt: string;
}

const SecondMain: React.FC = () => {
  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".start2",
      start: "top center",
      end: "bottom center",
      animation: gsap.to(".gsap2", { opacity: 1, duration: 1, stagger: 0.2 }),
      toggleActions: "restart reverse restart reverse",
    });
  }, []);
  const babyImg: BabyImage[] = [
    { src: "imageSilde/slide1.jpeg", alt: "애기사진1" },
    { src: "imageSilde/slide2.jpeg", alt: "애기사진2" },
    { src: "imageSilde/slide3.jpeg", alt: "애기사진3" },
    { src: "imageSilde/slide4.jpeg", alt: "애기사진4" },
    { src: "imageSilde/slide5.jpeg", alt: "애기사진5" },
    { src: "imageSilde/slide6.jpeg", alt: "애기사진6" },
    { src: "imageSilde/slide7.jpeg", alt: "애기사진7" },
    { src: "imageSilde/slide8.jpeg", alt: "애기사진8" },
    { src: "imageSilde/slide9.jpeg", alt: "애기사진9" },
    { src: "imageSilde/slide10.jpeg", alt: "애기사진10" },
    { src: "imageSilde/slide11.jpeg", alt: "애기사진11" },
    { src: "imageSilde/slide12.jpeg", alt: "애기사진12" },
  ];

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  SwiperCore.use([Navigation, Pagination, Autoplay]);

  return (
    <div className="start2 relative w-full h-screen snap-center bg-white">
      <div className="h-screen flex flex-col justify-center items-center text-center">
        <img
          className="absolute w-[80%] min-w-[280px] max-w-[550px] lg:w-[60%] lg:min-w-[59%] right-0"
          src="main/main2.svg"
          alt="Main Image"
        />
      </div>
      <div className="gsap2 opacity-0 absolute top-44 max-sm:pr-[50px] max-sm:ml-10 ml-20">
        <h1 className="text-left font-bold leading-loose text-3xl lg:text-5xl max-sm:pr-5 max-sm:text-2xl">
          함께 나누고 <br />
          함께 성장하는{" "}
          <span className="text-btn-green-color">우리 동네 어린이집</span>
        </h1>
        <p className="max-sm:pr-5 text-left lg:leading-loose lg:text-base leading-loose text-sm">
          서울 내 수많은 어린이집 중 가깝고, 확실한 정보를 제공하는{" "}
          <span className="text-btn-green-color">우동집</span>에서 우리아이
          어린이집을 찾아보세요
        </p>
      </div>
      <div className="absolute bottom-20 left-0 right-0 w-full">
        <Swiper
          className="gsap2 w-full rounded-md opacity-0"
          autoplay={{ delay: 2000 }}
          loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            720: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
        >
          {babyImg.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <img
                  className=" drop-shadow-lg  w-full h-60 object-cover rounded-3xl hover:scale-105 "
                  src={item.src}
                  alt={item.alt}
                />
              </SwiperSlide>
            );
          })}
          <div className="relative z-40">
            {prevRef.current && (
              <button
                ref={prevRef}
                className="left-5 secondButton"
                type="button"
              >
                <IoIosArrowDropleft className="gsap2 opacity-0 secondButtonImage" />
              </button>
            )}
            {nextRef.current && (
              <button
                ref={nextRef}
                className="right-5 secondButton"
                type="button"
              >
                <IoIosArrowDropright className="gsap2 opacity-0 secondButtonImage" />
              </button>
            )}
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default SecondMain;
