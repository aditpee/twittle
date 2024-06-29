import { ArrowBack } from "@mui/icons-material";
import { useEffect, useRef } from "react";
import { useState } from "react";
import "./register.scss";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import axios from "axios";
import { API_URL, PF } from "../../config";
import EmailVerify from "./EmailVerify";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [validateUsername, setValidateUsername] = useState(null);
  const [validateEmail, setValidateEmail] = useState(null);
  const [validatePassword, setValidatePassword] = useState(null);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(null);

  const debounced = useDebouncedCallback((e, fnCallback) => {
    fnCallback(e);
  }, 1000);

  const setCustomErrorMessage = (inputElement, message, fnState) => {
    fnState(message);
    inputElement.classList.add("invalid");
  };
  const removeCustomErrorMessage = (elementInput, fnState) => {
    fnState(null);
    elementInput.classList.remove("invalid");
  };

  const checkExistingUserByUsername = async (e) => {
    if (e.target.value.length < 4) {
      return;
    }
    try {
      await axios.get(
        API_URL + "/api/auth/checkExistUser?username=" + e.target.value
      );
    } catch (err) {
      setCustomErrorMessage(
        usernameRef.current,
        err.response.data,
        setValidateUsername
      );
    }
  };
  const checkExistingUserByEmail = async (e) => {
    if (e.target.value.length < 4) {
      return;
    }
    try {
      await axios.get(
        API_URL + "/api/auth/checkExistUser?email=" + e.target.value
      );
    } catch (err) {
      setCustomErrorMessage(
        emailRef.current,
        err.response.data,
        setValidateEmail
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setCustomErrorMessage(
        confirmPasswordRef.current,
        "Password not match!",
        setValidateConfirmPassword
      );
      setLoading(false);
      return;
    }
    try {
      const user = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      const res = await axios.post(API_URL + "/api/auth/register", user);
      console.log(res);
      setLoading(false);
      setIsRegisterSuccess(true);
    } catch (err) {
      setLoading(false);
      const { errors, error } = err.response.data;
      if (error) {
        toast.error(error, {
          position: "top-center",
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: false,
          hideProgressBar: true,
          isLoading: false,
          autoClose: 7000,
        });
      }
      if (errors) {
        errors.map((error) => {
          if (error.path === "username") {
            setCustomErrorMessage(
              usernameRef.current,
              error.msg,
              setValidateUsername
            );
          }
          if (error.path === "email") {
            setCustomErrorMessage(
              emailRef.current,
              error.msg,
              setValidateEmail
            );
          }
          if (error.path === "password") {
            setCustomErrorMessage(
              passwordRef.current,
              error.msg,
              setValidatePassword
            );
          }
        });
      }
    }
  };

  return (
    <main className="register section">
      <div className="register-modal container">
        {isRegisterSuccess ? (
          <EmailVerify />
        ) : (
          <>
            <div
              className="register-close pointer"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBack />
            </div>
            <div className="register-modal-wrapper flow">
              <div className="register-logo mx-auto">
                <img src={PF + "/images/logo.svg"} alt="" />
              </div>
              <h1 className="fs-800 fw-bold margin-block-end-5 text-left">
                Create an account
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="register-inputs twittle-inputs">
                  <div>
                    <div>
                      <input
                        ref={usernameRef}
                        id="username"
                        className="coba clr-neutral-800"
                        placeholder=" "
                        type="text"
                        required
                        onChange={(e) =>
                          debounced(e, checkExistingUserByUsername)
                        }
                        onInput={(e) =>
                          removeCustomErrorMessage(
                            e.target,
                            setValidateUsername
                          )
                        }
                      />
                      <label
                        htmlFor="username"
                        className="label register-label clr-neutral-600"
                      >
                        Username
                      </label>
                    </div>
                    {validateUsername && (
                      <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                        {validateUsername}
                      </p>
                    )}
                  </div>
                  <div>
                    <div>
                      <input
                        ref={emailRef}
                        id="email"
                        className="clr-neutral-800"
                        placeholder=" "
                        type="email"
                        required
                        onChange={(e) => debounced(e, checkExistingUserByEmail)}
                        onInput={(e) =>
                          removeCustomErrorMessage(e.target, setValidateEmail)
                        }
                      />
                      <label
                        htmlFor="email"
                        className="register-label clr-neutral-600"
                      >
                        Email
                      </label>
                    </div>
                    {validateEmail && (
                      <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                        {validateEmail}
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
                        onInput={(e) =>
                          removeCustomErrorMessage(
                            e.target,
                            setValidatePassword
                          )
                        }
                      />
                      <label
                        htmlFor="password"
                        className="register-label clr-neutral-600"
                      >
                        Password
                      </label>
                    </div>
                    {validatePassword && (
                      <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                        {validatePassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <div>
                      <input
                        ref={confirmPasswordRef}
                        id="confirm-password"
                        className="clr-neutral-800"
                        placeholder=" "
                        type="password"
                        required
                        onInput={(e) =>
                          removeCustomErrorMessage(
                            e.target,
                            setValidateConfirmPassword
                          )
                        }
                      />
                      <label
                        htmlFor="confirm-password"
                        className="register-label clr-neutral-600"
                      >
                        Confirm password
                      </label>
                    </div>
                    {validateConfirmPassword && (
                      <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                        {validateConfirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className={`register-button fw-bold fs-600 bg-neutral-800 clr-neutral-000 margin-block-start-10 radius-2 padding-block-3 ${
                    loading ? "cursor-progerss" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "loading..." : "Next"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Register;

// const validateNoSpaceValue = (stringVal) => {
//   return /\s/g.test(stringVal);
// };

// const handleInputUsername = (e) => {
//   removeCustomErrorMessage(e.target, setValidateUsername);

//   const regexUsername = new RegExp("^[a-zA-Z0-9_]+$");

//   const invalidUsername = !regexUsername.test(e.target.value);
//   const invalidUsernameMessage =
//     "Your username can only contain letters, numbers and '_'";
//   const isHaveSpace = validateNoSpaceValue(e.target.value);
//   const haveSpaceMessage = "Cannot have space";
//   const isDontHaveVal = e.target.value === "";
//   const dontHaveValMessage = "This input must have value";

//   if (invalidUsername)
//     setCustomErrorMessage(
//       e.target,
//       invalidUsernameMessage,
//       setValidateUsername
//     );
//   if (isHaveSpace)
//     setCustomErrorMessage(e.target, haveSpaceMessage, setValidateUsername);
//   if (isDontHaveVal)
//     setCustomErrorMessage(e.target, dontHaveValMessage, setValidateUsername);
// };

// const handleInputEmail = (e) => {
//   removeCustomErrorMessage(e.target, setValidateEmail);

//   const isValidEmail = validate(e.target.value);
//   const invalidEmailMessage = "aaaa, enter a valid email";

//   if (!isValidEmail)
//     setCustomErrorMessage(e.target, invalidEmailMessage, setValidateEmail);
// };

// const handleInputPassword = (e) => {
//   removeCustomErrorMessage(e.target, setValidatePassword);

//   const isValidLength = e.target.value.length >= 8;
//   const invalidLengthMessage = "aaaa must be at least 8 chararters long";

//   if (!isValidLength)
//     setCustomErrorMessage(
//       e.target,
//       invalidLengthMessage,
//       setValidatePassword
//     );
// };

// const handleInputConfirmPassword = (e) => {
//   removeCustomErrorMessage(e.target, setValidateConfirmPassword);

//   const isValidLength = e.target.value.length >= 8;
//   const invalidLengthMessage = "Password must be at least 8 chararters long";

//   if (!isValidLength)
//     setCustomErrorMessage(
//       e.target,
//       invalidLengthMessage,
//       setValidateConfirmPassword
//     );

//   if (e.target.value !== passwordRef.current.value) {
//     setCustomErrorMessage(
//       e.target,
//       "Password don't match",
//       setValidateConfirmPassword
//     );
//   }
// };
