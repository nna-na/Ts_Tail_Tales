import React from "react";
import { Link, Outlet } from "react-router-dom";
import MainFooter from "../components/mains/MainFooter";

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
          backgroundColor: "#F8B3B3",
          color: "white",
        }}
      >
        <Link to="/" style={{ color: "black", textDecoration: "none" }}>
          로고
        </Link>
        {/* 로고 링크 이동하는법! 색이랑 밑줄 꼴보기 싫어서 없애버렸다 고마워 구글 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <Link to="/home" style={{ color: "black", textDecoration: "none" }}>
            기다리는 친구들 |
          </Link>
          <Link
            to="/community"
            style={{ color: "black", textDecoration: "none" }}
          >
            커뮤니티 |
          </Link>
          <Link
            to="/aboutus"
            style={{ color: "black", textDecoration: "none" }}
          >
            about us |
          </Link>
          <Link to="/login" style={{ color: "black", textDecoration: "none" }}>
            로그인
          </Link>
        </div>
      </header>
      {/* main */}
      <Outlet />
    </div>
  );
}

export default Layout;
