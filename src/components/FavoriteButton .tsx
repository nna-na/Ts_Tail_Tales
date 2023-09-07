import React from "react";
import { supabase } from "../supabase";
import { AnimalShelter } from "../api/fetchData";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { styled } from "styled-components";

interface FavoriteButtonProps {
  item: AnimalShelter;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRemoveFavorite?: () => void;
}

function FavoriteButton({ item, isLoggedIn, isFavorite, onToggleFavorite, onRemoveFavorite }: FavoriteButtonProps) {
  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      alert("로그인 후 즐겨찾기를 이용해주세요.");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        alert("사용자 정보를 가져오는 중 오류 발생");
        return;
      }

      const user = userData?.user;
      const userId = user?.id;

      if (!userId) {
        alert("사용자의 ID를 찾을 수 없습니다.");
        return;
      }

      const { data: existingFavorites, error: existingFavoritesError } = await supabase.from("favorites").select().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);

      if (existingFavoritesError) {
        alert("기존 즐겨찾기를 가져오는 중 오류 발생");
        return;
      }

      if (existingFavorites && existingFavorites.length > 0) {
        const { error: deleteError } = await supabase.from("favorites").delete().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);

        if (deleteError) {
          alert("즐겨찾기 삭제 중 오류 발생");
          return;
        }
        if (onRemoveFavorite) {
          onRemoveFavorite(); // 여기서 호출
        }
      } else {
        const { error: addError } = await supabase.from("favorites").upsert({
          userId: userId,
          animalId: item.ABDM_IDNTFY_NO,
          isFavorite: true,
          email: user.email,
        });

        if (addError) {
          alert("즐겨찾기 추가 중 오류 발생");
          return;
        }
      }
    } catch (error) {
      alert("즐겨찾기 전환 중 오류 발생");
    }

    onToggleFavorite(); // 호출해서 상태 변경 요청
  };

  return (
    <HeartBtn onClick={handleToggleFavorite}>
      {isFavorite ? (
        <FaHeart
          style={{
            color: "#ff4828",
          }}
        />
      ) : (
        <FaHeart
          style={{
            color: "rgba(87, 76, 76, 0.3)",
          }}
        />
      )}
    </HeartBtn>
  );
}

export default FavoriteButton;

const HeartBtn = styled.button`
  // position: absolute;
  // margin: 5px 5px;
  border: none;
  background: none;
  font-size: 35px;
  cursor: pointer;
  transition: transform 0.3s ease; /* 추가: 변환 애니메이션 효과 */

  &:hover {
    transform: scale(1.2); /* 추가: 마우스 오버 시 크기 조정 */
  }
`;
