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
    // // 1. 세션스토리지에서 user 정보를 가져온다.
    // const storedUser = sessionStorage.getItem("user");
    // // 2.
    // if (storedUser) {
    //   const parsedUser = JSON.parse(storedUser);
    //   setUser(parsedUser);

    //   const nickname = parsedUser.user_metadata.user_name || parsedUser.user_metadata.full_name;
    //   setUserNickname(nickname);

    //   if (parsedUser.email) {
    //     sessionStorage.setItem("userEmail", parsedUser.email);
    //   }
    //   sessionStorage.setItem("userNickname", nickname);
    // }

    // 새로고침 할 때 필요한 로직을 추가한다.
    // 1. sessionStorgae에서 user가 저장되어 있는지 확인한다.
    // 2. user가 있으면 setUser 하고 아니면 아무것도 안한다.
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const nickname =
        parsedUser.user_metadata.user_name ||
        parsedUser.user_metadata.full_name;
      setUserNickname(nickname);
    }

    // onAuthStateChange로 로그인 상태가 변경되면 아래 작업을 실행한다.
    // 1. 로그인을 하면 setUser, setUserNickname을 한다 & 로그아웃하면 setUser null
    // 2. sessionStorage에 저장한다 & sessionStorage에서 없애버림

    // 로그인 여부를 감시하는 로직
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        // 유저가 로그인을 했으면
        if (event === "SIGNED_IN" && session) {
          const parsedUser = session.user;
          // useState에 user 저장
          setUser(parsedUser);
          // 세션 스토리지에 user 정보를 넣어준다.
          sessionStorage.setItem("user", JSON.stringify(parsedUser));

          // 닉네임은 parsedUser에서 user_name이나 full_name을 가져온다.
          const nickname =
            parsedUser.user_metadata.user_name ||
            parsedUser.user_metadata.full_name;
          // useState에 저장한다
          setUserNickname(nickname);

          // email이 있으면
          if (parsedUser.email) {
            // userEmail이라는 sessionStorage에 키로 넣어준다.
            sessionStorage.setItem("userEmail", parsedUser.email);
          }
          // userNickname이라는 sessionStorage에 키로 넣어준다.
          sessionStorage.setItem("userNickname", nickname);

          // 로그아웃하면 useState도 지우고, sessionStorage도 지운다.
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          sessionStorage.removeItem("user");
          setUserNickname(null);
          sessionStorage.removeItem("userNickname");
          sessionStorage.removeItem("userEmail");
        }
      }
    );

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
              <Buttons to={`/mypage/${user.id}`}>{userNickname}님</Buttons>,
              환영합니다!
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
  background-color: transparent;

  // background-color: rgba(112, 101, 100, 0.05);
  /* 투명 배경색 */
  color: white;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 유리 효과를 주는 그림자 */
  // backdrop-filter: blur(10px);
  /* 유리 효과의 블러 효과 */
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;
const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
