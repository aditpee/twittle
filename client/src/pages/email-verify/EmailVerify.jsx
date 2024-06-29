import "./email-verify.scss";
import Login from "../login/Login";
import { useEffect, useRef, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
// import "react-toastify/dist/ReactToastify.css";

const EmailVerify = () => {
  const toastId = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { userId, token: tokenEmail } = useParams();

  useEffect(() => {
    const id = toast.loading("Verification your email...", {
      position: "top-center",
      theme: "colored",
      closeOnClick: true,
      pauseOnHover: false,
      hideProgressBar: true,
    });

    const getData = async () => {
      try {
        const urlApi = `${API_URL}/api/users/${userId}/verify/${tokenEmail}`;
        const res = await axios.put(urlApi);
        toast.update(id, {
          render: `${res.data.message}`,
          type: "success",
          isLoading: false,
          autoClose: 7000,
        });
        navigate("/login");
      } catch (err) {
        console.log(err);
        toast.update(id, {
          render: `${err.response.data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 7000,
        });
        navigate("/login", {
          replace: true,
        });
      }
    };
    getData();
  }, [navigate, tokenEmail, userId]);

  return (
    <>
      <Login />
    </>
  );
};

export default EmailVerify;
