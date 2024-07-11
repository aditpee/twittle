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
    case "EDIT_PROFILE":
      return {
        isLoading: false,
        user: {
          ...state.user,
          name: action.payload.name,
          username: action.payload.username,
          bio: action.payload.bio,
          location: action.payload.location,
          website: action.payload.website,
          avatar: action.payload.avatar,
          cover: action.payload.cover,
        },
        error: false,
        token: state.token,
      };
    case "FOLLOW":
      return {
        isLoading: false,
        user: {
          ...state.user,
          followers: [...state.user.followers, action.newFollower],
        },
        error: false,
        token: state.token,
      };
    case "UNFOLLOW":
      return {
        isLoading: false,
        user: {
          ...state.user,
          followers: state.user.followers.filter(
            (id) => id !== action.oldFollower
          ),
        },
        error: false,
        token: state.token,
      };
    default:
      return state;
  }
};

export default AuthReducer;
