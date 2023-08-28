import React from "react";

export default function Mypage() {
  return <div>Mypage</div>;
}

// import React from "react";
// import { useFavorites } from "../components/FavoritesContext";
// import { AnimalShelter } from "../api/fetchData";

// export default function Mypage() {
//   const { favorites } = useFavorites();
//   if (favorites.length === 0) {
//     return;
//   }

//   return (
//     <div>
//       <h2>즐겨찾기 목록</h2>
//       <div>
//         {favorites.map((item: AnimalShelter) => (
//           <div key={item.ABDM_IDNTFY_NO}>{item.SPECIES_NM}</div>
//         ))}
//       </div>
//     </div>
//   );
// }
