import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, AnimalShelter } from "../api/fetchData";
import styled from "styled-components";
import FavoriteButton from "./FavoriteButton ";
import { supabase } from "../supabase";

export interface PetCardProps {
  item: AnimalShelter;
}

function PetCard({ item }: PetCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "");
        const { id: userId } = user;

        // 서버에서 즐겨찾기 상태 가져오기
        const { data: existingFavorites, error: existingFavoritesError } =
          await supabase
            .from("favorites")
            .select()
            .eq("userId", userId)
            .eq("animalId", item.ABDM_IDNTFY_NO);

        if (existingFavoritesError) {
          console.error(
            "Error fetching existing favorites:",
            existingFavoritesError
          );
          return;
        }

        setIsFavorite(existingFavorites && existingFavorites.length > 0);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchData();
  }, [item.ABDM_IDNTFY_NO]);

  const handleToggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  console.log("isFavorite", isFavorite);

  return (
    <Box>
      <div
        onClick={() =>
          navigate(`/detail/${item.ABDM_IDNTFY_NO}`, {
            state: { item },
          })
        }
      >
        <FavoriteButton
          item={item}
          isLoggedIn={true}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
        />

        <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
        <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
        <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
        <p>품종 : {item.SPECIES_NM}</p>
        <p>성별 : {item.SEX_NM}</p>
        <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
        <p>특징: {item.SFETR_INFO}</p>
        <p>상태: {item.STATE_NM}</p>
        <p>보호 주소:{item.SIGUN_NM} </p>
      </div>
    </Box>
  );
}

export default PetCard;

const PetImg = styled.img`
  width: 100%;
  height: 280px;
  max-width: 400px;
  object-fit: cover;
`;

const Box = styled.div`
  padding: 10px 10px 10px 10px;
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 calc(33.33% - 10px);
  box-sizing: border-box;
`;
