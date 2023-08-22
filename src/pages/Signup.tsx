import React, { useState, FormEvent } from "react";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const signupHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: nickname,
          },
        },
      });

      if (!signUpError) {
        // 회원 가입 성공 시 추가 정보 업데이트
        if (signUpData?.user) {
          // .user 프로퍼티 확인
          const { data: profileData, error: profileError } = await supabase.from("profiles").upsert([
            {
              id: signUpData.user.id as string,
              nickname,
            },
          ]);

          if (profileError) {
            alert("회원 정보 추가 중 오류가 발생했습니다.");
          } else {
            alert("회원 가입 및 추가 정보 등록이 완료되었습니다.");
          }
        } else {
          alert("회원 가입 중 오류가 발생했습니다.");
        }
      } else {
        alert(signUpError.message);
      }
    } catch (error) {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>회원 가입</h1>
      <form onSubmit={signupHandler}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="nickname">닉네임:</label>
          <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <button type="submit">가입</button>
      </form>
    </div>
  );
}

export default SignUp;
