import { createContext } from "react";
import PropTypes from "prop-types";
import { useReducer } from "react";
import { useEffect } from "react";

const INITIAL_STATE = {
  color: "",
  bg: "black",
  font: "15",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_COLOR":
      return {
        ...state,
        color: action.theme,
      };
    case "CHANGE_BG":
      return {
        ...state,
        bg: action.theme,
      };
    case "CHANGE_FONT":
      return {
        ...state,
        font: action.theme,
      };

    default:
      return state;
  }
};

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const themebg = localStorage.getItem("themebg");
  const themecolor = localStorage.getItem("themecolor");

  useEffect(() => {
    // const changeTheme = () => {
    //   switch (state.bg) {
    //     case "default":
    //       return document.body.setAttribute("data-bg", "");
    //     case "dim":
    //       return document.body.setAttribute("data-bg", "dim");
    //     case "black":
    //       return document.body.setAttribute("data-bg", "black");

    //     default:
    //       return state;
    //   }
    // };
    // changeTheme();
    if (themebg) {
      document.body.setAttribute("data-bg", themebg);
      dispatch({ type: "CHANGE_BG", theme: themebg });
    } else {
      document.body.setAttribute("data-bg", "black");
    }
    if (themecolor) {
      document.body.setAttribute("data-color", themecolor);
      dispatch({ type: "CHANGE_COLOR", theme: themecolor });
    } else {
      document.body.setAttribute("data-color", "");
    }
  }, [themebg, themecolor]);

  return (
    <ThemeContext.Provider
      value={{
        color: state.color,
        font: state.font,
        bg: state.bg,
        dispatch: dispatch,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.element,
};
