import React, { useState, useEffect } from "react";
import { getCurrent } from "../api/fetchData";
import { GrNext, GrPrevious } from "react-icons/gr";

export default function Slider() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [postPerPage, setPostPerPage] = useState("4"); // postPerPage 상태 추가

  const handleResize = () => {
    setWindowWidth(window.innerWidth);

    // 창 크기에 따라 postPerPage 상태 업데이트
    if (windowWidth < 520) {
      setPostPerPage("1");
    } else if (windowWidth < 768) {
      setPostPerPage("2");
    } else if (windowWidth < 1024) {
      setPostPerPage("3");
    } else {
      setPostPerPage("4");
    }
  };

  const [current, setCurrent] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0); // currentSlide 상태 추가

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    getCurrent().then((data) => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const filteredData = data.filter((item: any) => {
        const receptDate = new Date(item.RECEPT_DE);
        return receptDate >= oneDayAgo;
      });

      setCurrent(filteredData);
    });
  }, [windowWidth]);

  const TOTAL_SLIDES: number = Math.ceil(current.length / +postPerPage) - 1;
  const lastPostIndex: number = (currentSlide + 1) * +postPerPage;
  const firstPostIndex: number = lastPostIndex - +postPerPage;
  const currentPosts: any[] = current.slice(firstPostIndex, lastPostIndex);

  const NextSlide = () => {
    if (currentSlide >= TOTAL_SLIDES) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const PrevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(TOTAL_SLIDES);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="slider">
      <h2>공고기한이 얼마 남지않은 친구들이예요!</h2>
      <div className="slides">
        {currentPosts.map((item) => (
          <div key={item.ABDM_IDNTFY_NO}>{/* 간단한 div로 변경 */}</div>
        ))}
      </div>
      <div className="move">
        <GrPrevious className="icon" onClick={PrevSlide} />
        <GrNext className="icon" onClick={NextSlide} />
      </div>
    </div>
  );
}
