import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // 리치 텍스트 에디터 스타일 시트
import Quill from "quill";
import ImageResize from "@looop/quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

interface PostImgProps {
  onContentChange: (newContent: string) => void;
}

export default function PostImg({ onContentChange }: PostImgProps) {
  const [content, setContent] = useState(""); // 초기 내용 상태

  const handleContentChange = (newContent: string) => {
    setContent(newContent); // 상태 업데이트
    onContentChange(newContent); // 상위 컴포넌트로 변경된 내용 전달
  };
  ///yarn add --dev @types/quill-image-resize
  // yarn add @types/quill-image-resize-module-react --dev

  return (
    <div>
      <h2>리치 텍스트 에디터</h2>
      <ReactQuill
        style={{
          width: "1000px",
          height: "400px",
          marginBottom: "50px",
        }}
        value={content} // 초기 내용 설정
        onChange={handleContentChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["image"], // 이미지 삽입 버튼 추가
          ],
          ImageResize: {
            parchment: Quill.import("parchment"),
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "list",
          "bold",
          "italic",
          "underline",
          "image", // 이미지 포맷 추가
        ]}
      />
    </div>
  );
}
