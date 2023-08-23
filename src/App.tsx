import { Routes, Route, Link } from "react-router-dom";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Layout from "./common/Layout";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Main from "./pages/Main";
import PostCreate from "./pages/PostCreate";
import PostEdit from "./pages/PostEdit";
import Community from "./pages/Community";
import Aboutus from "./pages/Aboutus";
import PostDetail from "./pages/PostDetail";
// animals={[]} loading={false} error={null} />}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/create" element={<PostCreate />} />
        <Route path="/edit/:id" element={<PostEdit />} />
        <Route path="/post-detail/:id" element={<PostDetail posts={[]} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<Mypage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/aboutus" element={<Aboutus />} />
      </Route>
      <Route
        path="*"
        element={
          <>
            <div>없는 페이지입니다.</div>
            <Link to="/">홈으로 이동</Link>
          </>
        }
      />
    </Routes>
  );
}

export default App;
