import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";
import Category from "../components/Category";
function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<Array<AnimalShelter> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  // 날짜 범위, 지역, 품종 상태 추가
  const [selectedBeginDate, setSelectedBeginDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setData(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();
        setData(fetchedData);
      } catch (e: Error | unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An error occurred"));
        }
      }
      setLoading(false);
    };
    fetchDataFromApi();
  }, []);

  const handleFilter = () => {
    setCurrentPage(1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const nearingDeadline = data.filter((item) => {
    const today = new Date(); // 현재 날짜
    const endOfNotice = new Date(formatDate(item.PBLANC_END_DE)); // 게시물의 공고 마감일

    // 마감일이 현재 날짜로부터 3일 이내인 경우만 필터링
    const fiveDaysAfter = new Date(today);
    fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 5);

    return endOfNotice <= fiveDaysAfter;
  });

  // 선택한 조건에 따라 데이터 필터링
  const filteredItems = data.filter((item) => {
    let matchesDate = true;
    let matchesLocation = true;
    let matchesBreed = true;

    if (selectedBeginDate && selectedEndDate) {
      matchesDate =
        formatDate(item.RECEPT_DE) >= selectedBeginDate &&
        formatDate(item.RECEPT_DE) <= selectedEndDate;
    }
    if (selectedLocation) {
      matchesLocation = item.SIGUN_NM.toLowerCase().includes(
        selectedLocation.toLowerCase()
      );
    }
    if (selectedBreed) {
      matchesBreed = item.SPECIES_NM.split("]")[0] + "]" === selectedBreed;
    }
    return matchesDate && matchesLocation && matchesBreed;
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
      <Pagination>
        {prevPage && (
          <PageNumber
            key="prev"
            onClick={() => setCurrentPage(prevPage)}
            isActive={false}
          >
            이전
          </PageNumber>
        )}
        {pageNumbers?.map((number) => {
          if (number === currentPage) {
            return (
              <PageNumber
                key={number}
                onClick={() => setCurrentPage(number)}
                isActive={true}
              >
                {number}
              </PageNumber>
            );
          } else if (
            number === 1 ||
            number === totalPages ||
            (number >= currentPage - 2 && number <= currentPage + 2)
          ) {
            return (
              <PageNumber
                key={number}
                onClick={() => setCurrentPage(number)}
                isActive={false}
              >
                {number}
              </PageNumber>
            );
          } else if (number === totalPages - 1) {
            return (
              <PageNumber key="ellipsis" onClick={() => {}} isActive={false}>
                ...
              </PageNumber>
            );
          }
          return null;
        })}
        {nextPage && (
          <PageNumber
            key="next"
            onClick={() => setCurrentPage(nextPage)}
            isActive={false}
          >
            다음
          </PageNumber>
        )}
      </Pagination>
    );
  };
  return (
    <div className="Home">
      <div>공고 마감일이 하루 남은 게시물 필터링</div>
      <Container>
        {nearingDeadline?.map((item: AnimalShelter) => (
          <Box key={item.ABDM_IDNTFY_NO}>
            <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
            <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
            <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
            <p>품종 : {item.SPECIES_NM}</p>
            <p>성별 : {item.SEX_NM}</p>
            <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
            <p>특징: {item.SFETR_INFO}</p>
            <p>상태: {item.STATE_NM}</p>
            <p>보호 주소:{item.SIGUN_NM} </p>
          </Box>
        ))}
      </Container>
      <Category
        query={{
          PBLANC_BEGIN_DE: selectedBeginDate,
          PBLANC_END_DE: selectedEndDate,
          SIGUN_NM: selectedLocation,
          SPECIES_NM: selectedBreed,
        }}
        onChange={(e) => {
          const { name, value } = e.target;
          if (name === "PBLANC_BEGIN_DE") {
            setSelectedBeginDate(value);
          } else if (name === "PBLANC_END_DE") {
            setSelectedEndDate(value);
          } else if (name === "SIGUN_NM") {
            setSelectedLocation(value);
          } else if (name === "SPECIES_NM") {
            setSelectedBreed(value);
          }
          handleFilter();
        }}
      />
      <Container>
        {currentItems?.map((item: AnimalShelter) => (
          <Box
            key={item.ABDM_IDNTFY_NO}
            onClick={() =>
              navigate(`/detail/${item.ABDM_IDNTFY_NO}`, {
                state: { item },
              })
            }
          >
            <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
            <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
            <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
            <p>품종 : {item.SPECIES_NM}</p>
            <p>성별 : {item.SEX_NM}</p>
            <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
            <p>특징: {item.SFETR_INFO}</p>
            <p>상태: {item.STATE_NM}</p>
            <p>보호 주소:{item.SIGUN_NM} </p>
          </Box>
        ))}
      </Container>
      {renderPagination()}
    </div>
  );
}
export default Home;
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px;
`;
const Box = styled.div`
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 calc(33.33% - 10px);
  box-sizing: border-box;
`;
const PetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 400px;
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const PageNumber = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  margin: 0 5px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;
