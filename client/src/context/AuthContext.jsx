import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import AuthReducer from "./AuthReducer";
import { useEffect } from "react";
import { Logout } from "./AuthAction";
import { verifyJwtCall } from "../apiCalls";
import { useState } from "react";

const INITIAL_STATE = {
  user: null,
  isLoading: true,
  error: false,
  token: null,
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    const tokenJwt = localStorage.getItem("token");
    if (!tokenJwt) return dispatch(Logout());

    verifyJwtCall(tokenJwt, dispatch);
    setToken(tokenJwt);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        token: state.token,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.element,
};
