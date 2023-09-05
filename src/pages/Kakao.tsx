import { useEffect } from "react";
const { kakao } = window;

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

export default function Kakao({ lat, log, kind, shelter }: KakaoProps) {
  function smoothZoom(map: any, level: number, offset = 0) {
    const currentLevel = map.getLevel();
    const step = Math.abs(level - currentLevel) / 10;

    function stepZoom() {
      if (level > currentLevel && currentLevel + step < level) {
        map.setLevel(currentLevel + step);
        setTimeout(stepZoom, 80);
      } else if (level < currentLevel && currentLevel - step > level) {
        map.setLevel(currentLevel - step);
        setTimeout(stepZoom, 80);
      } else {
        map.setLevel(level);
      }
    }

    stepZoom();
  }
  useEffect(() => {
    const container = document.getElementById("map");
    if (container) {
      container.style.width = "100%";
      container.style.height = "400px";

      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new window.kakao.maps.LatLng(lat, log),
        level: 3, //지도의 레벨(확대, 축소 정도)
      };
      //지도 생성 및 객체 리턴
      const map = new window.kakao.maps.Map(container, options);
      // 지도 확대 축소 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      let imageSrc;
      if (kind === "[개]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/1623/1623792.png";
      } else if (kind === "[고양이]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";
      } else {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/3196/3196017.png";
      }
      // 마커이미지의 주소입니다
      const imageSize = new window.kakao.maps.Size(50, 50);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const markerPosition = new window.kakao.maps.LatLng(lat, log);

      // 마커를 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      // 마커가 지도 위에 표시되도록 설정
      marker.setMap(map);
      // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능
      const content =
        '<div class="customoverlay">' +
        `    <span class="title">${shelter}</span>` +
        "</div>";
      // 커스텀 오버레이가 표시될 위치입니다
      const position = new kakao.maps.LatLng(lat, log);
      // 커스텀 오버레이를 생성합니다
      const customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        xAnchor: 0.5,
        yAnchor: 0.91,
      });
    }
  });

  return <div id="map"></div>;
}
