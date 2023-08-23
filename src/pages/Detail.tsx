import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import Kakao from "./Kakao";
import { useNavigate } from "react-router-dom";

function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state;

  return (
    <div className="detail container">
      <button onClick={() => navigate("/home")}>뒤로가기</button>
      <div className="top">
        <div className="img-container">
          <PetImg src={item.IMAGE_COURS} alt={item.ABDM_IDNTFY_NO} />
          <div id={item.ABDM_IDNTFY_NO} data-pet={item.pet} />
        </div>
        <div className="description">
          <div className="noticeNo">
            <span>공고번호</span>
            <span>{item.PBLANC_IDNTFY_NO}</span>
          </div>
          <div className="table">
            <div className="row">
              <span>품종</span>
              <span>{item.SPECIES_NM.split("]")[1]}</span>
            </div>
            <div className="row">
              <span>성별</span>
              <span>{item.SEX_NM}</span>
            </div>
            <div className="row">
              <span>중성화 여부</span>
              <span>{item.NEUT_YN}</span>
            </div>
            <div className="row">
              <span>나이 / 체중</span>
              <span>
                {new Date().getFullYear() - item.AGE_INFO.slice(0, 4) + 1}살 /
                &nbsp;
                {item.BDWGH_INFO.split("(")[0]}kg
              </span>
            </div>
            <div className="row">
              <span>접수일시</span>
              <span>{item.RECEPT_DE}</span>
            </div>
            <div className="row">
              <span>빌견장소</span>
              <span>{item.DISCVRY_PLC_INFO}</span>
            </div>
            <div className="row">
              <span>특징</span>
              <span>{item.SFETR_INFO}</span>
            </div>
            <div className="row">
              <span>공고기한</span>
              <span>
                {item.PBLANC_BEGIN_DE} ~ {item.PBLANC_END_DE}
              </span>
            </div>
            <div className="row">
              <span>보호센터</span>
              <span>{item.SHTER_NM}</span>
            </div>
            <div className="row">
              <span>보호센터 주소</span>
              <span>{item.REFINE_ROADNM_ADDR}</span>
            </div>
            <div className="row">
              <span>보호센터 연락처</span>
              <span>{item.SHTER_TELNO}</span>
            </div>
            <div className="row">
              <span>보호장소</span>
              <span>{item.PROTECT_PLC}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="location">
        <p>
          <span>{item.SHTER_NM}</span>
          에서 기다리고 있어요!
        </p>

        <Kakao
          lat={item.REFINE_WGS84_LAT}
          log={item.REFINE_WGS84_LOGT}
          shelter={item.SHTER_NM}
          kind={item.SPECIES_NM.split(" ")[0]}
        />
      </div>
    </div>
  );
}

export default Detail;

const PetImg = styled.img`
  width: 600px;
  object-fit: contain;
`;
