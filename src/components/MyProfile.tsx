import { Avatar } from "antd";
import React, { useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export default function MyProfile() {
  const [Image, setImage] = useState("/image/header/profile.jpg");
  const fileInput = useRef<HTMLInputElement | null>(null); // HTMLInputElement 타입으로 명시
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 파일이 선택되면 이벤트 핸들러 실행
    const selectedFile = e.target.files?.[0]; // 옵셔널 체이닝 연산자 사용
    if (selectedFile) {
      // 파일이 선택되면 선택된 파일을 처리하는 로직을 추가할 수 있습니다.
      // 예를 들어, 이미지 업로드 등의 작업을 수행할 수 있습니다.
      console.log("선택된 파일:", selectedFile);
      // 선택된 파일을 화면에 표시하기 위해 이미지 URL 생성
      const imageUrl = URL.createObjectURL(selectedFile);
      // 이미지 URL을 상태에 설정하여 화면에 표시
      setImage(imageUrl);
    }
  };
  return (
    <>
      <Avatar
        src={Image}
        style={{ margin: "20px" }}
        size={200}
        onClick={() => {
          fileInput?.current?.click();
        }} // 옵셔널 체이닝 연산자 사용
      />
      {/* 파일 입력(input type="file") 요소에 ref를 연결 */}
      <input
        type="file"
        accept="image/*" // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
        style={{ display: "none" }} // 화면에 표시하지 않음
        ref={fileInput}
        onChange={handleFileInputChange} // 파일 선택 시 이벤트 핸들러 호출
      />
    </>
  );
}
