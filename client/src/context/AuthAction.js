export const LoginStart = (user) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user, tokenJwt) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
  token: tokenJwt,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Logout = () => ({
  type: "LOGOUT",
});
