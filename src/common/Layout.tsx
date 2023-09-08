import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTop";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

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

    // const handleScroll = () => {
    //   if (window.scrollY > 600) {
    //     setIsHeaderVisible(false);
    //   } else {
    //     setIsHeaderVisible(true);
    //   }
    // };

    // window.addEventListener("scroll", handleScroll);

    return () => {
      authSubscription.data.subscription.unsubscribe();
      // window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const shouldShowScrollToTop = location.pathname !== "/";

  return (
    <Wrap>
      {isHeaderVisible && (
        <Header>
          <LogoLink to="/">TailTales</LogoLink>
          <HeaderContent>
            {user && userNickname && (
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
            )}
            <Buttons to="/home">기다리는 친구들 |</Buttons>
            <Buttons to="/community">커뮤니티 |</Buttons>
            {user ? (
              <LogoutButton
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  setUserNickname(null);
                  alert("로그아웃이 완료되었습니다.");
                  navigate("/");
                }}
              >
                로그아웃
              </LogoutButton>
            ) : (
              <Buttons to="/login">로그인</Buttons>
            )}
          </HeaderContent>
        </Header>
      )}

      <OutletWrap>
        <Outlet />
      </OutletWrap>
      {shouldShowScrollToTop && <ScrollToTop />}
    </Wrap>
  );
}

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
  background-color: transparent;
  color: white;
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
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

const Wrap = styled.header`
  min-height: 100vh;
  position: relative;
  padding-bottom: 90px;
  box-sizing: border-box;
`;

const OutletWrap = styled.div`
  padding-top: 80px;
`;

const Buttons = styled(Link)`
  text-decoration: none;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const LogoutButton = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
`;
