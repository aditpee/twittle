import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { PF } from "../../config";
import { LoginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowBack } from "../../utils/icons/icons";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [usernameErrMsg, setUsernameErrMsg] = useState("");
  const [passwordErrMsg, setPasswordErrMsg] = useState("");

  const [isEmail, setIsEmail] = useState(false);

  const { user, dispatch, error, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrMsg("");
    setPasswordErrMsg("");

    const userCredential = {
      username: !isEmail ? usernameRef.current.value : null,
      email: isEmail ? usernameRef.current.value : null,
      password: passwordRef.current.value,
    };
    LoginCall(userCredential, dispatch);
  };

  useEffect(() => {
    const {
      username: usernameErr,
      password: passwordErr,
      email: emailErr,
    } = error;
    if (error) {
      if (usernameErr) {
        setUsernameErrMsg(usernameErr);
      }
      if (emailErr) {
        setUsernameErrMsg(emailErr);
      }
      if (passwordErr) {
        setPasswordErrMsg(passwordErr);
      } else {
        toast.error(error.error, {
          position: "top-center",
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: false,
          hideProgressBar: true,
          autoClose: false,
        });
      }
    }
    if (user) {
      // navigate("/home");
    }
  }, [error, user]);

  return (
    <main className="login section">
      <div className="login-modal container bg-neutral-000 flow">
        <div
          className="login-close pointer clr-neutral-800"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowBack />
        </div>
        <div className="login-logo mx-auto">
          <img src={PF + "/images/logo.svg"} alt="" />
        </div>
        <h1 className="fs-800 clr-neutral-800 fw-bold margin-block-end-5 text-left">
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
                  onInput={(e) => {
                    setUsernameErrMsg("");

                    /@/.test(e.target.value)
                      ? setIsEmail(true)
                      : setIsEmail(false);
                  }}
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
                  onInput={() => {
                    setPasswordErrMsg("");
                  }}
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
          <button
            disabled={isLoading}
            className="login-button fs-300 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2 margin-block-start-10 "
          >
            Next
          </button>
        </form>
        <p className="fs-300 clr-neutral-800 text-left">
          Don’t have an account?{" "}
          <span className="clr-primary-000">Sign up</span>
        </p>
      </div>
    </main>
  );
};

export default Login;
