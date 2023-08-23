import React, { useState, useEffect } from "react";
import Category from "../components/Category";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<Array<AnimalShelter> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState({
    PBLANC_BEGIN_DE: "",
    PBLANC_END_DE: "",
    SIGUN_NM: "전체",
    SPECIES_NM: "",
  });

  // itemsPerPage 변수 정의
  const itemsPerPage = 9;

  // handleChange 함수 정의
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  // totalPages 변수 정의
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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

        {pageNumbers.map((number) => {
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
      <Category query={query} onChange={handleChange} />
      <Container>
        {currentItems.map((item: AnimalShelter) => (
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
            <p>지역 : {item.SIGUN_NM}</p>
            <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
            <p>품종 : {item.SPECIES_NM}</p>
            <p>성별 : {item.SEX_NM}</p>
            <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
            <p>특징: {item.SFETR_INFO}</p>
            <p>상태: {item.STATE_NM}</p>
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
