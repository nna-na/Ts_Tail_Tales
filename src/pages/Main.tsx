import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <div>
      <Link to="/Home" style={{ color: "black", textDecoration: "none" }}>
        홈으로 이동하기
      </Link>
      <div>Main</div>
    </div>
  );
}
