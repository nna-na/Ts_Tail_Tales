import React, { useEffect } from "react";
import styled from "styled-components";

interface PageNumberProps {
  isActive: boolean;
}

const StyledPageNumber = styled.div<PageNumberProps>`
  cursor: pointer;
  margin: 0 10px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  display: inline-block;
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 변경될 때 스크롤을 페이지 상단으로 이동
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;

      pageNumbers.push(
        <StyledPageNumber
          key={i}
          isActive={isActive}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </StyledPageNumber>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      {prevPage && (
        <StyledPageNumber
          isActive={false}
          onClick={() => handlePageClick(prevPage)}
        >
          이전
        </StyledPageNumber>
      )}
      {renderPageNumbers()}
      {nextPage && (
        <StyledPageNumber
          isActive={false}
          onClick={() => handlePageClick(nextPage)}
        >
          다음
        </StyledPageNumber>
      )}
    </div>
  );
}

export default Pagination;
