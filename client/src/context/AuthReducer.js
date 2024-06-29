const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        isLoading: true,
        user: null,
        error: false,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        isLoading: false,
        user: action.payload,
        error: false,
        token: action.token,
      };
    case "LOGIN_FAILURE":
      return {
        isLoading: false,
        user: null,
        error: action.payload,
        token: null,
      };
    case "LOGOUT":
      return {
        isLoading: false,
        user: null,
        error: false,
        token: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
