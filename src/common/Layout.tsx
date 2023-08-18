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
          position: "fixed",
          left: 0,
          right: 0,
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
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <Link to="/home" style={{ color: "black", textDecoration: "none" }}>
            기다리는 친구들 |
          </Link>
          <Link to="/community" style={{ color: "black", textDecoration: "none" }}>
            커뮤니티 |
          </Link>
          <Link to="/aboutus" style={{ color: "black", textDecoration: "none" }}>
            about us |
          </Link>
          <Link to="/login" style={{ color: "black", textDecoration: "none" }}>
            로그인
          </Link>
        </div>
      </header>
      <div
        style={{
          paddingTop: "80px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
