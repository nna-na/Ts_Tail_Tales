import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faCoffee } from "@fortawesome/free-solid-svg-icons";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const nickname =
        parsedUser.user_metadata.user_name ||
        parsedUser.user_metadata.full_name;
      setUserNickname(nickname);
    }

    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const parsedUser = session.user;
          setUser(parsedUser);
          sessionStorage.setItem("user", JSON.stringify(parsedUser));

          const nickname =
            parsedUser.user_metadata.user_name ||
            parsedUser.user_metadata.full_name;
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
      }
    );

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const shouldShowScrollToTop = location.pathname !== "/";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setShowMobileMenu(false);
      } else {
        setShowMobileMenu(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Wrap>
      {isHeaderVisible && (
        <Header>
          <LogoLink to="/">TailTales</LogoLink>
          <HeaderContent>
            {window.innerWidth < 700 ? (
              <MobileMenuButton
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} />
              </MobileMenuButton>
            ) : (
              <>
                {user && userNickname && (
                  <UserContainer>
                    <UserImage>
                      <img
                        src={
                          user?.user_metadata.avatar_url ||
                          process.env.PUBLIC_URL + "/image/header/profile.jpg"
                        }
                        alt="User Avatar"
                      />
                    </UserImage>
                    <UserName>
                      <span>
                        <Buttons to={`/mypage/${user.id}`}>
                          {userNickname}님
                        </Buttons>
                        , 환영합니다!
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
              </>
            )}
          </HeaderContent>
        </Header>
      )}

      {showMobileMenu &&
        window.innerWidth < 700 && ( // 모바일 메뉴가 표시되고 화면이 700px 미만인 경우에만 SideMenu 표시
          <SideMenu onClick={() => setShowMobileMenu(false)}>
            <button className="xbtn" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {user && userNickname && (
              <UserContainer>
                <UserImage>
                  <img
                    src={
                      user?.user_metadata.avatar_url ||
                      process.env.PUBLIC_URL + "/image/header/profile.jpg"
                    }
                    alt="User Avatar"
                  />
                </UserImage>
                <UserSideName className="username">
                  <span>
                    <MenuItem to={`/mypage/${user.id}`}>
                      {userNickname}님
                    </MenuItem>
                    , 환영합니다!
                  </span>
                </UserSideName>
              </UserContainer>
            )}
            <MenuItem to="/home">기다리는 친구들</MenuItem>
            <MenuItem to="/community">커뮤니티</MenuItem>
            <div>
              {user ? (
                <ButtonItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    setUserNickname(null);
                    alert("로그아웃이 완료되었습니다.");
                    navigate("/");
                  }}
                >
                  로그아웃
                </ButtonItem>
              ) : (
                <MenuItem to="/login">로그인</MenuItem>
              )}
            </div>
          </SideMenu>
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
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

const UserSideName = styled.span`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const LogoutButton = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const MobileMenuButton = styled.button`
  display: none; /* 초기에는 표시하지 않음 */

  @media (max-width: 700px) {
    display: block; /* 화면이 작을 때만 표시 */
    color: white;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 70%;
  background-color: white;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  box-shadow: -2px 0px 5px 0px rgba(0, 0, 0, 0.3);

  button {
    align-self: flex-end;
    margin-right: 5px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    color: #333;
  }
`;

const MenuItem = styled(Link)`
  margin-left: 9px;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.2s;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const ButtonItem = styled.button`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;
