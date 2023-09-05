import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import styled from "styled-components";
function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          sessionStorage.setItem("user", JSON.stringify(session.user));
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          sessionStorage.removeItem("user");
        }
      }
    );
    if (user) {
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
      if (user.email) {
        sessionStorage.setItem("userEmail", user.email);
      }
      sessionStorage.setItem(
        "userNickname",
        user.user_metadata.user_name || user.user_metadata.full_name
      );
    }
    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, [user]);
  // 로그아웃 함수 정의
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserNickname(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userNickname");
    sessionStorage.removeItem("userEmail");
    alert("로그아웃 됐다~~~");
  };
  // 로그인 버튼 렌더링 함수 정의
  const renderLoginButton = () => {
    if (user) {
      return (
        <Link
          style={{
            color: "black",
            textDecoration: "none",
          }}
          to="/"
          onClick={handleLogout}
        >
          로그아웃
        </Link>
      );
    } else {
      return (
        <Link to="/login" style={{ color: "black", textDecoration: "none" }}>
          로그인
        </Link>
      );
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingBottom: "90px",
        boxSizing: "border-box",
      }}
    >
      <Header>
        <LogoLink to="/">TailTales</LogoLink>
        <HeaderContent>
          {user && userNickname ? (
            <UserContainer>
              <UserImage>
                <img
                  src={
                    user?.user_metadata.avatar_url ||
                    process.env.PUBLIC_URL + "/image/profile.jpg"
                  }
                  alt="User Avatar"
                />
              </UserImage>
              <UserName>
                {userNickname && (
                  <span>
                    <Link to={`/mypage/${user.id}`}>{userNickname}님</Link>,
                    환영합니다!
                  </span>
                )}
                {!userNickname && user?.user_metadata.full_name && (
                  <span>
                    {`${user?.user_metadata.full_name}님`}, 환영합니다!
                  </span>
                )}
              </UserName>
            </UserContainer>
          ) : null}
          <Link to="/home">기다리는 친구들 |</Link>
          <Link to="/community">커뮤니티 |</Link>
          {renderLoginButton()}
        </HeaderContent>
      </Header>
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
const Header = styled.header`
  position: fixed;
  height: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: #746464;
  color: white;
  z-index: 1000;
`;
const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 30px;
`;
const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;
const UserImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const UserName = styled.span`
  color: white;
  font-weight: bold;
`;
