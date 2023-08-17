import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .top {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${(props) => props.theme.textBlack};
    padding-block: 4rem;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 4rem;
    }
    .img-container {
      position: relative;
      height: fit-content;
      overflow: hidden;
      margin-bottom: 4rem;

      @media (min-width: 768px) {
        width: 50%;
        margin-bottom: 0;
      }

      img {
        width: 100%;
        border: 1px solid ${(props) => props.theme.textBlack};
        aspect-ratio: 1/1;
        object-fit: cover;
      }
    }

    .description {
      @media (min-width: 768px) {
        width: 50%;
      }

      .noticeNo {
        width: 100%;
        background-color: ${(props) => props.theme.textOrange};
        font-size: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
        padding-block: 1rem;
        border: 1px solid ${(props) => props.theme.textBlack};
      }

      .table {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        font-size: ${(props) => props.theme.pSize};

        .row {
          display: grid;
          grid-template-columns: 0.5fr 1fr;
          text-align: center;
          grid-template-rows: auto;
          padding: 0.7rem 0.5rem;
          border-bottom: 1px solid ${(props) => props.theme.textBlack};
          border-inline: 1px solid ${(props) => props.theme.textBlack};

          span {
            display: flex;
            justify-content: center;
            align-items: center;

            &:nth-child(1) {
              border-right: 1px solid ${(props) => props.theme.textBlack};
              font-weight: 600;
            }
            &:nth-child(2) {
              padding-left: 0.5rem;
            }
          }
        }
      }
    }
  }
  .location {
    font-size: ${(props) => props.theme.pSize};
    color: ${(props) => props.theme.textBlack};
    p {
      padding-bottom: 2rem;
      span {
        font-weight: 600;
      }
    }
  }
`;

export default function PetDetail() {
  // 페이지 들어오면 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="detail">
      <div className="top">
        <div className="img-container">
          {/* <img src={IMAGE_COURS} alt={ABDM_IDNTFY_NO} />
          <Mark id={ABDM_IDNTFY_NO} pet={pet} /> */}
          임시 이미지
        </div>
        <div className="description">
          <div className="noticeNo"></div>
          <div className="table">
            <div className="row">
              <span>공고번호</span>
              {/* <span>{PBLANC_IDNTFY_NO}</span> */}
              <span>임시 공고번호</span>
            </div>
            <div className="row">
              <span>품종</span>
              {/* <span>{SPECIES_NM.split("]")[1]}</span> */}
              <span>임시품종</span>
            </div>
            <div className="row">
              <span>성별</span>
              {/* <span>{sexFormat(SEX_NM)}</span> */}
              <span>임시 성별</span>
            </div>
            <div className="row">
              <span>중성화 여부</span>
              {/* <span>{neutFormat(NEUT_YN)}</span> */}
              <span>임시 중성화 여부</span>
            </div>
            <div className="row">
              <span>나이 / 체중</span>
              {/* <span>
                {new Date().getFullYear() - AGE_INFO.slice(0, 4) + 1}살 / &nbsp;
                {BDWGH_INFO.split("(")[0]}kg
              </span> */}
              <span>임시 나이/체중</span>
            </div>
            <div className="row">
              <span>접수일시</span>
              {/* <span>{dateFormat(RECEPT_DE)}</span> */}
              <span>임시 접수일시</span>
            </div>
            <div className="row">
              <span>빌견장소</span>
              {/* <span>{DISCVRY_PLC_INFO}</span> */}
              <span>임시 발견장소</span>
            </div>
            <div className="row">
              <span>특징</span>
              {/* <span>{SFETR_INFO}</span> */}
              <span>임시 특징</span>
            </div>
            <div className="row">
              <span>공고기한</span>
              {/* <span>
                {dateFormat(PBLANC_BEGIN_DE)} ~ {dateFormat(PBLANC_END_DE)}
                
              </span> */}
              <span>임시 공고기한</span>
            </div>
            <div className="row">
              <span>보호센터</span>
              {/* <span>{SHTER_NM}</span> */}
              <span>임시 보호센터 이름</span>
            </div>
            <div className="row">
              <span>보호센터 주소</span>
              {/* <span>{REFINE_ROADNM_ADDR}</span> */}
              <span>임시 보호센터 주소</span>
            </div>
            <div className="row">
              <span>보호센터 연락처</span>
              {/* <span>{SHTER_TELNO}</span> */}
              <span>임시 보호센터 연락처</span>
            </div>
            <div className="row">
              <span>보호장소</span>
              {/* <span>{PROTECT_PLC}</span> */}
              <span>임시 보호장소</span>
            </div>
          </div>
        </div>
      </div>
      <div className="location">
        <p>
          {/* <span>{SHTER_NM}</span> */}
          임시장소 에서 기다리고 있어요!
        </p>
        {/* <Kakao
          lat={REFINE_WGS84_LAT}
          log={REFINE_WGS84_LOGT}
          shelter={SHTER_NM}
          kind={SPECIES_NM.split(" ")[0]}
        /> */}
        여기는 지도
      </div>
    </Container>
  );
}
