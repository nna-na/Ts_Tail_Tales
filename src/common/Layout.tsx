import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import styled from "styled-components";

function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const nickname = parsedUser.user_metadata.user_name || parsedUser.user_metadata.full_name;
      setUserNickname(nickname);

      if (parsedUser.email) {
        sessionStorage.setItem("userEmail", parsedUser.email);
      }
      sessionStorage.setItem("userNickname", nickname);
    }

    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const parsedUser = session.user;
        setUser(parsedUser);
        sessionStorage.setItem("user", JSON.stringify(parsedUser));

        const nickname = parsedUser.user_metadata.user_name || parsedUser.user_metadata.full_name;
        setUserNickname(nickname);

        if (parsedUser.email) {
          sessionStorage.setItem("userEmail", parsedUser.email);
        }
        sessionStorage.setItem("userNickname", nickname);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        sessionStorage.removeItem("user");
        setUserNickname(null);
        sessionStorage.removeItem("userNickname");
        sessionStorage.removeItem("userEmail");
      }
    });
    const handleScroll = () => {
      // 여기서 100은 헤더가 사라지기 시작하는 스크롤 위치입니다. 원하는 값으로 조정할 수 있습니다.
      if (window.scrollY > 600) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      authSubscription.data.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNickname = () => {
    if (user && userNickname) {
      return (
        <UserContainer>
          <UserImage>
            <img src={user?.user_metadata.avatar_url || process.env.PUBLIC_URL + "/image/header/profile.jpg"} alt="User Avatar" />
          </UserImage>
          <UserName>
            <span>
              <Buttons to={`/mypage/${user.id}`}>{userNickname}님</Buttons>, 환영합니다!
            </span>
          </UserName>
        </UserContainer>
      );
    }
    return null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserNickname(null);
    alert("로그아웃 됐다~~~");
  };

  const renderLoginButton = () => {
    if (user) {
      return (
        <Link
          style={{
            color: "white",
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
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
          로그인
        </Link>
      );
    }
  };

  return (
    <Wrap>
      {isHeaderVisible && (
        <Header>
          <LogoLink to="/">TailTales</LogoLink>
          <HeaderContent>
            {handleNickname()}
            <Buttons to="/home">기다리는 친구들 |</Buttons>
            <Buttons to="/community">커뮤니티 |</Buttons>
            {renderLoginButton()}
          </HeaderContent>
        </Header>
      )}

      <OutletWrap>
        <Outlet />
      </OutletWrap>
    </Wrap>
  );
}

const Wrap = styled.header`
  min-height: 100vh;
  position: relative;
  padding-bottom: 90px;
  box-sizing: border-box;
`;

export default Layout;

const Header = styled.header`
  position: fixed;
  height: 32px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: rgba(112, 101, 100, 0.05); /* 투명 배경색 */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 유리 효과를 주는 그림자 */
  backdrop-filter: blur(10px); /* 유리 효과의 블러 효과 */
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
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

const OutletWrap = styled.div`
  padding-top: 80px;
`;

const Buttons = styled(Link)`
  text-decoration: none;
  color: white;
`;
