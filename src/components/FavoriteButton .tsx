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

function FavoriteButton({
  item,
  isLoggedIn,
  isFavorite,
  onToggleFavorite,
  onRemoveFavorite,
}: FavoriteButtonProps) {
  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      alert("로그인 후 즐겨찾기를 이용해주세요.");
      return;
    }

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }

      const user = userData?.user;
      const userId = user?.id;

      if (!userId) {
        console.error("User ID not found.");
        return;
      }

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

      if (existingFavorites && existingFavorites.length > 0) {
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("userId", userId)
          .eq("animalId", item.ABDM_IDNTFY_NO);

        if (deleteError) {
          console.error("Error deleting favorite:", deleteError);
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
          console.error("Error adding favorite:", addError);
          return;
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }

    onToggleFavorite(); // 호출해서 상태 변경 요청
  };

  return (
    <HeartBtn onClick={handleToggleFavorite}>
      {isFavorite ? (
        <FaHeart
          style={{
            color: "#f8b3b3",
          }}
        />
      ) : (
        <FaRegHeart
          style={{
            color: "#f8b3b3",
          }}
        />
      )}
    </HeartBtn>
  );
}

export default FavoriteButton;

const HeartBtn = styled.button`
  border: none;
  background-color: white;
  font-size: 30px;
  cursor: pointer;
  transition: transform 0.3s ease; /* 추가: 변환 애니메이션 효과 */

  &:hover {
    transform: scale(1.2); /* 추가: 마우스 오버 시 크기 조정 */
  }
`;
