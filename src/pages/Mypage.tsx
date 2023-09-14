import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData";
import PetCard from "../components/Petcard";
import { supabase } from "../supabase";
import styled from "styled-components";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import usePageHook from "../hooks/pageHook";
import Swal from "sweetalert2";
import MyProfile from "../components/MyProfile";

function Mypage() {
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userMetadata, setUserMetadata] = useState({ user_profile: "" }); // userMetadata 상태 추가
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem, itemsPerPage } = usePageHook(3);
  const navigate = useNavigate();
  const currentFavoriteAnimals = favoriteAnimals.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // 유저 정보 가져오기
    const getUserInfo = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      const email = user?.email;
      const nickname = user?.user_metadata.name || user?.user_metadata.user_name;
      const avatar = user?.user_metadata.avatar_url;
      const user_profile = user?.user_metadata.user_profile; // user_profile 값을 가져옴
      setUserEmail(email || "");
      setUserNickname(nickname || "");
      setUserAvatar(avatar || "");
      setUserMetadata({ user_profile }); // user_profile을 userMetadata 상태에 설정
    };
    getUserInfo();
  }, []);
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();

        // 데이터가 존재하지 않을 경우에만 API 요청
        if (favoriteAnimals.length === 0) {
          const fetchedData = await fetchAnimalData(); // 데이터 가져오기
          setFavoriteAnimals(fetchedData); // 가져온 데이터를 상태에 설정
        }

        // 사용자의 즐겨찾기 정보 가져오기
        const { data: favoriteData, error: favoriteError } = await supabase.from("favorites").select("animalId").eq("email", userEmail);

        if (favoriteError) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "사용자 즐겨찾기 항목 가져오기 오류",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
          });
          return;
        }

        const favoriteAnimalIds = favoriteData.map((fav: any) => fav.animalId);

        // 사용자의 즐겨찾기한 동물 정보 필터링
        const favoriteAnimalsWithEmail = fetchedData.filter((item: any) => favoriteAnimalIds.includes(item.ABDM_IDNTFY_NO));

        setFavoriteAnimals(favoriteAnimalsWithEmail);
      } catch (e: Error | unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An error occurred"));
        }
      }
      setLoading(false);
    };

    if (userEmail) {
      fetchDataFromApi();
    }
  }, [userEmail]);

  const removeFavorite = (animalId: string) => {
    setFavoriteAnimals((prevFavorites) => prevFavorites.filter((item) => item.ABDM_IDNTFY_NO !== animalId));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const { data, error } = await supabase.storage.from("image/profiles").upload(`${userEmail}/${file.name}`, file, { upsert: true });
        if (error) {
          console.error("프로필 사진 업로드 오류:", error);
          return;
        }
        const imagePath = `https://livvtclsfcwcjiljzxhh.supabase.co/storage/v1/object/public/image/profiles/${userEmail}/${file.name}`;
        setUserAvatar(imagePath);
        // 사용자 정보 가져오기
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("사용자 정보 가져오기 오류:", userError);
          return;
        }
        // user_metadata 객체의 존재 여부 확인
        const userMetadata = userData.user.user_metadata || {};
        // user_metadata 객체에 user_profile 업데이트
        userMetadata.user_profile = imagePath;
        // user 키 안에 있는 user_metadata 객체를 완전히 대체
        const { data: updateddata, error: uadatederror } = await supabase.auth.updateUser({
          data: { user_profile: imagePath },
        });
        // 프로필 이미지 업로드 성공 메시지 등을 표시할 수 있습니다.
        Swal.fire({
          position: "center",
          icon: "success",
          title: "프로필 사진이 업로드되었습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
        console.log(userMetadata.user_profile);
      } catch (error: any) {
        console.error("프로필 사진 업로드 중 오류:", error);
        // 업로드 오류에 대한 처리를 추가할 수 있습니다.
      }
    }
  };

  return (
    <MyPage>
      <StDetailText>
        <BackIcon
          className="backBtn"
          onClick={() => {
            navigate("/home");
          }}
        >
          〈
        </BackIcon>
        <h2 className="detailtext">My page</h2>
      </StDetailText>
      <ContentContainer>
        <LeftContent>
          <h3>Your Profile</h3>
          {userAvatar ? <AvatarImage src={userAvatar} alt="User Avatar" /> : <MyProfile />}
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: userMetadata.user_profile ? "block" : "none" }} />
          <h4>{userNickname}님, 반가워요!</h4>
          <BottomText>
            동물 친구들이 당신과 함께라면,
            <br /> 언제나 활기찬 행복이 가득합니다
          </BottomText>
        </LeftContent>
        <RightContent>
          <h3>{userNickname}님 관심 가져주셔서 감사해요!</h3>
          {!loading ? (
            <Container>
              {currentFavoriteAnimals?.map((item) => (
                <PetCard
                  key={item.ABDM_IDNTFY_NO}
                  item={item}
                  onRemoveFavorite={() => {
                    if (item.ABDM_IDNTFY_NO) {
                      removeFavorite(item.ABDM_IDNTFY_NO);
                    }
                  }}
                />
              ))}
            </Container>
          ) : (
            <p>Loading...</p>
          )}
          {!loading && <Pagination currentPage={currentPage} totalPages={Math.ceil(favoriteAnimals.length / itemsPerPage)} setCurrentPage={setCurrentPage} />}
        </RightContent>
      </ContentContainer>
    </MyPage>
  );
}
export default Mypage;
const StDetailText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  margin-top: 50px;
  padding-right: 40px;
  .backBtn {
    background: none;
    border: none;
    color: black;
    margin-right: 5px;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
      color: #868686;
    }
  }
  .detailtext {
    margin: 0 auto;
    text-align: center;
    max-width: 350px;
    padding: 20px 0 20px;
  }
  strong {
    color: #746464;
  }
`;
const BackIcon = styled.button`
  margin-left: 20px;
  // margin-right: 5px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.7);
    color: #868686;
  }
`;
const MyPage = styled.div`
  // padding: 20px;
  width: 100%;
  height: 100%;
  margin: 0 auto; /* 수평 가운데 정렬 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1349px) {
    flex-direction: row;
  }
  align-items: flex-start;
  height: 600px;
  div {
  }
`;
const LeftContent = styled.div`
  min-width: 25%;
  // height: 100%;
  background-color: #746464;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 1349px) {
    width: 100%;
  }
  /* background-image: url("/image/mypage/mypage01.jpg");
  background-size: cover; */
  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background: #746464;
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    @media (max-width: 1349px) {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  h4 {
    color: white;
  }
`;
const RightContent = styled.div`
  width: 75%;
  height: 100%;
  background-color: #fdfaf6;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    background: #746464;
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  @media (max-width: 1349px) {
    width: 100%;
    // overflow-x: auto; /* 가로 스크롤 추가 */
  }
`;
const Container = styled.div`
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  // padding-right: 65px;
  gap: 20px;
  // padding-top: 30px;
  @media (max-width: 1349px) {
    width: 90%;
    overflow-x: auto;
    justify-content: flex-start;
  }
`;
const AvatarImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 20px;
`;
const BottomText = styled.h5`
  position: absolute;
  bottom: 15%;
  font-size: 16px;
  color: #746464;
  @media (max-width: 1349px) {
    display: none;
  }
`;
