import axios from "axios";
import { API_URL } from "./config";
import { LoginFailure, LoginStart, LoginSuccess } from "./context/AuthAction";

export const LoginCall = async (userCredential, dispatch) => {
  // dispatch(LoginStart());
  try {
    const res = await axios.post(API_URL + "/api/auth/login", userCredential);
    dispatch(LoginSuccess(res.data.user, res.data.token));
    localStorage.setItem("token", res.data.token);
  } catch (error) {
    dispatch(LoginFailure(error.response.data));
  }
};

export const verifyJwtCall = async (token, dispatch) => {
  dispatch(LoginStart());
  try {
    const res = await axios.get(API_URL + "/api/auth/verifyJwt", {
      headers: {
        Authorization: token,
      },
    });
    dispatch(LoginSuccess(res.data, token));
  } catch (error) {
    console.log(error);
    dispatch(LoginFailure(error.response.data.error));
  }
};
