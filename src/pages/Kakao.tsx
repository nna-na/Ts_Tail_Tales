import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoProps {
  lat: number;
  log: number;
  shelter: string;
  kind: string;
}

export default function Kakao({ lat, log, kind }: KakaoProps) {
  useEffect(() => {
    const container = document.getElementById("map");
    if (container) {
      container.style.width = "50%";
      container.style.height = "400px";

      const options = {
        center: new window.kakao.maps.LatLng(lat, log),
        level: 7,
      };

      const map = new window.kakao.maps.Map(container, options);

      let imageSrc;
      if (kind === "[개]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/1623/1623792.png";
      } else if (kind === "[고양이]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";
      } else {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/3196/3196017.png";
      }

      const imageSize = new window.kakao.maps.Size(50, 50);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const markerPosition = new window.kakao.maps.LatLng(lat, log);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);
    }
  });

  return <div id="map"></div>;
}
