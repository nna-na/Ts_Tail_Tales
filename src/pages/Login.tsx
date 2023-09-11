import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { supabase } from "../supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function signInWithEmail(e: FormEvent) {
    e.preventDefault();

    if (!email && !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    } else if (password.length < 6) {
      alert("비밀번호 6자리 이상 입력해주세요.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      alert("일치하는 정보가 없습니다.");
    } else if (data) {
      const confirmed = window.confirm("로그인 하시겠습니까?");
      if (confirmed) {
        navigate("/home");
      }
    }
  }

  const loginWithKakao = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });
    if (response.error) {
      console.error(response.error);
    }
  };

  const loginWithGoogle = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (response.error) {
      console.error(response.error);
    }
  };

  return (
    <LoginContainer>
      <LeftSide>
        <img src="/image/login/login2-1.png" alt="사진" />
      </LeftSide>
      <RightSide>
        <h2>TailTales</h2>
        <LoginFormContainer>
          <form onSubmit={signInWithEmail}>
            <div>
              <input
                type="email"
                id="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button>로그인</button>
            </div>
          </form>
        </LoginFormContainer>
        <p>소셜 로그인</p>
        <div>
          <StKakaoLoginBtn onClick={loginWithKakao}>
            <img
              className="kakaoimg"
              src="/image/social/kakao.png"
              alt="Kakao Login"
            />
          </StKakaoLoginBtn>
          <StGoogleLoginBtn onClick={loginWithGoogle}>
            <img
              className="googleimg"
              src="/image/social/google.png"
              alt="Google Login"
            />
          </StGoogleLoginBtn>
        </div>
        <NoAccountMessage>
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </NoAccountMessage>
      </RightSide>
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RightSide = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdfaf6;

  h2 {
    padding: 100px 0 20px;
    margin-top: 50px;
  }
`;

const LoginFormContainer = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-right: 20px;
  }

  form {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 20px;
    }

    input {
      width: 270px;
      height: 45px;
      padding: 5px 16px;
      font-size: 15px;
      border: none;
      border-radius: 10px;
      background: #e4dfd9;
      transition: transform 0.3s ease;
      cursor: pointer;

      &:focus {
        border-radius: 10px;
      }

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        width: 100%;
        margin: 10px 0;
      }
    }

    button {
      width: 192px;
      height: 44px;
      margin: 5px 55px;
      cursor: pointer;
      font-size: 15px;
      border: none;
      color: white;
      border-radius: 999px;
      background: #746464;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        width: 100%;
        margin: 10px 0;
      }
    }
  }
`;

const StKakaoLoginBtn = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .kakaoimg {
    width: 45px;
    height: auto;
  }
`;

const StGoogleLoginBtn = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .googleimg {
    width: 45px;
    height: auto;
  }
`;

const NoAccountMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;

  a {
    color: #333;
    text-decoration: underline;

    &:hover {
      color: #555;
    }
  }
`;
