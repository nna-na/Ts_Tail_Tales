import React from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingBottom: "90px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "24px",
          backgroundColor: "#000000",
          color: "white",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          로고
        </Link>
        {/* 로고 링크 이동하는법! 색이랑 밑줄 꼴보기 싫어서 없애버렸다 고마워 구글 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <Link to="/Login" style={{ color: "white", textDecoration: "none" }}>
            로그인
          </Link>
          <Link to="/Signup" style={{ color: "white", textDecoration: "none" }}>
            회원가입
          </Link>
          {/* 로그인이랑 회원가입 링크 연동 */}
        </div>
      </header>
      {/* main */}
      <Outlet />
      <footer
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          padding: "24px",
          backgroundColor: "#EEEEEE",
          color: "black",
          position: "absolute",
          bottom: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div>문의하기</div>
        <div>SNS 채널들</div>
      </footer>
    </div>
  );
}

export default Layout;
