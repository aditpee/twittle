import { Suspense } from "react";
import { useContext, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { AuthContext } from "./context/AuthContext";
// import EditProfile from "./pages/edit-profile/EditProfile";
// import EmailVerify from "./pages/email-verify/EmailVerify";
// import Explore from "./pages/explore/Explore";
// import Home from "./pages/home/Home";
// import Login from "./pages/login/Login";
// import Profile from "./pages/profile/Profile";
// import Register from "./pages/register/Register";
// import ReplyPost from "./pages/reply-post/ReplyPost";
// import Welcome from "./pages/welcome/Welcome";
const EditProfile = lazy(() => import("./pages/edit-profile/EditProfile"));
const EmailVerify = lazy(() => import("./pages/email-verify/EmailVerify"));
const Explore = lazy(() => import("./pages/explore/Explore"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Register = lazy(() => import("./pages/register/Register"));
const ReplyPost = lazy(() => import("./pages/reply-post/ReplyPost"));
const Welcome = lazy(() => import("./pages/welcome/Welcome"));

function App() {
  const { user, isLoading } = useContext(AuthContext);

  const navigateToWelcomePage = (elementWhenUserExist) =>
    isLoading && !user ? (
      <Loader isCenterPage={true} />
    ) : !isLoading && !user ? (
      <Navigate to={"/"} replace />
    ) : (
      <Suspense fallback={<Loader isCenterPage={true} />}>
        {elementWhenUserExist}
      </Suspense>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoading && !user ? (
              <Loader isCenterPage={true} />
            ) : !isLoading && user ? (
              <Navigate to={"/home"} replace />
            ) : (
              <Suspense fallback={<Loader isCenterPage={true} />}>
                <Welcome />
              </Suspense>
            )
          }
        >
          <Route
            path="register"
            element={
              <Suspense fallback={<Loader isCenterPage={true} />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<Loader isCenterPage={true} />}>
                <Login />
              </Suspense>
            }
          />
          <Route path="emailVerify/:userId/:token" element={<EmailVerify />} />
        </Route>
        <Route path="/home" element={navigateToWelcomePage(<Home />)} />
        <Route path="/explore" element={navigateToWelcomePage(<Explore />)} />
        <Route
          path="/:username/"
          element={navigateToWelcomePage(<Profile />)}
        />
        <Route
          path="/:username/:page"
          element={navigateToWelcomePage(<Profile />)}
        />
        <Route path="/:username/edit" element={<EditProfile />} />
        <Route
          path="/:username/:postId/reply"
          element={navigateToWelcomePage(<ReplyPost />)}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
