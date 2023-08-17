export {};
// import React, { useEffect } from "react";
// import { LatLng, Map, MarkerImage, CustomOverlay } from "kakao-js-api";

// interface KakaoProps {
//   lat: number;
//   lng: number;
//   shelter: string;
//   kind: string;
// }

// export default function Kakao({ lat, lng, shelter, kind }: KakaoProps) {
//   useEffect(() => {
//     const container = document.getElementById("map");
//     const options = {
//       center: new kakao.maps.LatLng(lat, lng),
//       level: 7,
//     };

//     const map = new kakao.maps.Map(container, options);

//     let imageSrc;
//     if (kind === "[개]") {
//       imageSrc = "https://cdn-icons-png.flaticon.com/512/1623/1623792.png";
//     } else if (kind === "[고양이]") {
//       imageSrc = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";
//     } else {
//       imageSrc = "https://cdn-icons-png.flaticon.com/512/3196/3196017.png";
//     }

//     const imageSize = new kakao.maps.Size(50, 50);
//     const imageOption = { offset: new kakao.maps.Point(27, 69) };

//     const markerImage = new kakao.maps.MarkerImage(
//       imageSrc,
//       imageSize,
//       imageOption
//     );
//     const markerPosition = new kakao.maps.LatLng(lat, lng);

//     const marker = new kakao.maps.Marker({
//       position: markerPosition,
//       image: markerImage,
//     });

//     marker.setMap(map);

//     const content =
//       '<div class="customoverlay">' +
//       `    <span class="title">${shelter}</span>` +
//       "</div>";

//     const position = new kakao.maps.LatLng(lat, lng);

//     const customOverlay = new kakao.maps.CustomOverlay({
//       map: map,
//       position: position,
//       content: content,
//       xAnchor: 0.5,
//       yAnchor: 0.91,
//     });
//   }, [lat, lng, shelter, kind]);

//   return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
// }
