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
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  const [selectedDate, setSelectedDate] = useState(""); // 선택한 날짜
  const [selectedLocation, setSelectedLocation] = useState(""); // 선택한 지역
  const [selectedBreed, setSelectedBreed] = useState(""); // 선택한 품종

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

  // 여기
  const handleFilter = () => {
    setCurrentPage(1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // 선택한 조건에 따라 데이터 필터링
  const filteredItems = data.filter((item) => {
    let matchesDate = true;
    let matchesLocation = true;
    let matchesBreed = true;

    if (selectedDate) {
      matchesDate = item.RECEPT_DE === selectedDate;
    }

    if (selectedLocation) {
      matchesLocation = item.SIGUN_NM.toLowerCase().includes(
        selectedLocation.toLowerCase()
      );
    }

    if (selectedBreed) {
      // 하 미친놈..
      matchesBreed = item.SPECIES_NM.split("]")[0] + "]" === selectedBreed;
    }

    return matchesDate && matchesLocation && matchesBreed;
  });
  console.log("필터", filteredItems);
  console.log("품종", selectedBreed);
  console.log("data", data[10].SPECIES_NM.split("]")[0] + "]");

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  console.log("해당 게시물", currentItems);

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // 이전 페이지와 다음 페이지 버튼을 추가합니다.
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
      <Category
        query={{
          PBLANC_BEGIN_DE: selectedDate,
          PBLANC_END_DE: selectedDate,
          SIGUN_NM: selectedLocation,
          SPECIES_NM: selectedBreed,
        }}
        onChange={(e) => {
          // 각 필터링 조건에 맞는 상태를 업데이트합니다.
          const { name, value } = e.target;
          if (name === "PBLANC_BEGIN_DE" || name === "PBLANC_END_DE") {
            setSelectedDate(value);
          } else if (name === "SIGUN_NM") {
            setSelectedLocation(value);
          } else if (name === "SPECIES_NM") {
            setSelectedBreed(value);
          }
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
  width: 400px;
  height: 250px;
  object-fit: contain;
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
