import "./site-header.scss";
import { ArrowBack, Settings } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { SearchOutline } from "../../utils/icons/icons";
import { useRef } from "react";
import SearchBar from "../search-bar/SearchBar";
import { useMediaQuery } from "@mui/material";

const SiteHeader = ({ setIsMenuHidden, type }) => {
  const [content, setContent] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  let { pathname } = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");

  useEffect(() => {
    const subPathname = pathname.substring(1);
    setContent(subPathname);
    console.log(content);
  }, [content, pathname]);

  const largeSiteHeaderSytle = {
    gridTemplateColumns: "1fr max-content",
  };
  const phoneSiteHeaderSytle = {
    gridTemplateColumns: "2rem 1fr max-content",
  };

  return (
    <header className="site-header">
      <div
        className="site-header-container container"
        style={
          !isPhoneScreen && !isSearchClicked
            ? largeSiteHeaderSytle
            : phoneSiteHeaderSytle
        }
      >
        {type === "search" &&
          (isSearchClicked ? (
            <ArrowBack
              onClick={() => setIsSearchClicked(false)}
              className="clr-neutral-800"
            />
          ) : (
            isPhoneScreen && (
              <div
                className="site-header-avatar radius-circle"
                onClick={() => setIsMenuHidden(false)}
              >
                <img src="./images/no-avatar.svg" alt="" />
              </div>
            )
          ))}
        {type === "logo" && (
          <div
            className="site-header-avatar radius-circle"
            onClick={() => setIsMenuHidden(false)}
          >
            <img src="./images/no-avatar.svg" alt="" />
          </div>
        )}
        <div className="site-header-search">
          {type === "logo" && (
            <div className="site-header-logo">
              <img src="./images/logo.svg" alt="" />
            </div>
          )}
          {type === "search" && (
            <SearchBar setIsSearchClicked={setIsSearchClicked} />
          )}
        </div>
        <Settings className="site-header-setting-icon" />
      </div>
    </header>
  );
};

SiteHeader.propTypes = {
  setIsMenuHidden: PropTypes.func,
  type: PropTypes.string,
};

export default SiteHeader;
