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
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const tokenJwt = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenJwt) return dispatch(Logout());

    verifyJwtCall(tokenJwt, dispatch);
  }, [tokenJwt]);

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
