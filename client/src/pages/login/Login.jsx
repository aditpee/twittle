import { useContext, useRef, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { PF } from "../../config";
import { LoginCall } from "../../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [usernameErrMsg, setUsernameErrMsg] = useState("");
  const [passwordErrMsg, setpasswordErrMsg] = useState("");

  const { user, dispatch, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameErrMsg("");
    setpasswordErrMsg("");

    const userCredential = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    LoginCall(userCredential, dispatch);
  };

  useEffect(() => {
    const { username: usernameErr, password: passwordErr } = error;
    if (error) {
      if (usernameErr) {
        setUsernameErrMsg(usernameErr);
      }
      if (passwordErr) {
        setpasswordErrMsg(passwordErr);
      }
      toast.error(error.error, {
        position: "top-center",
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: false,
        hideProgressBar: true,
        autoClose: false,
      });
    }
    if (user) {
      // navigate("/home");
    }
  }, [error, user, navigate]);

  return (
    <main className="login section">
      <div className="login-modal container flow">
        <div
          className="login-close pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowBack />
        </div>
        <div className="login-logo mx-auto">
          <img src={PF + "/images/logo.svg"} alt="" />
        </div>
        <h1 className="fs-800 fw-bold margin-block-end-5 text-left">
          Sign in to Twittle
        </h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="login-inputs twittle-inputs">
            <div>
              <div>
                <input
                  ref={usernameRef}
                  id="username-email"
                  className="coba clr-neutral-800"
                  placeholder=" "
                  type="text"
                  required
                />
                <label
                  htmlFor="username-email"
                  className="label login-label clr-neutral-600"
                >
                  Username or email
                </label>
              </div>
              {usernameErrMsg && (
                <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                  {usernameErrMsg}
                </p>
              )}
            </div>
            <div>
              <div>
                <input
                  ref={passwordRef}
                  id="password"
                  className="clr-neutral-800"
                  placeholder=" "
                  type="password"
                  required
                />
                <label
                  htmlFor="password"
                  className="login-label clr-neutral-600"
                >
                  Password
                </label>
              </div>
              {passwordErrMsg && (
                <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                  {passwordErrMsg}
                </p>
              )}
            </div>
          </div>
          <button className="login-button fw-bold fs-600 bg-neutral-800 clr-neutral-000 margin-block-start-10 radius-2 padding-block-3">
            Next
          </button>
        </form>
        <p className="fs-300 text-left">
          Don’t have an account?{" "}
          <span className="clr-primary-000">Sign up</span>
        </p>
      </div>
    </main>
  );
};

export default Login;
