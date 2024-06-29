import { Cancel } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useRef } from "react";
import useOutsideClick from "../../utils/hooks/useOutSideClick";
import { SearchOutline } from "../../utils/icons/icons";
import "./search-bar.scss";

const SearchBar = ({ setIsSearchClicked }) => {
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const handleClickOutside = () => {
    autoCompleteRef.current.classList.add("hide");
    setIsSearchClicked && setIsSearchClicked(false);
  };
  const handleClickInside = () => {
    autoCompleteRef.current.classList.remove("hide");
    setIsSearchClicked && setIsSearchClicked(true);
  };
  const searchBarRef = useOutsideClick(handleClickOutside, handleClickInside);

  return (
    <div className="search-bar" ref={searchBarRef}>
      <div className="bg-neutral-400 clr-neutral-600">
        <div className="d-flex align-center">
          <div className="search-bar-icon d-flex margin-inline-end-2">
            <SearchOutline />
          </div>
          <input
            placeholder="Search"
            className="clr-neutral-600 fs-300"
            type="input"
            ref={searchRef}
            value={searchValue}
            onInput={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div
          className="search-bar-icon-cancel clr-primary-000 d-flex"
          onClick={() => {
            setSearchValue("");
            searchRef.current.focus();
          }}
        >
          {searchValue ? (
            <Cancel onClick={() => setIsSearchClicked(true)} />
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        className="search-bar-autocomplete bg-neutral-000 hide"
        ref={autoCompleteRef}
      >
        {searchValue ? (
          <>
            <div className="search-bar-autocomplete-header clr-neutral-600">
              <p>Search for {searchValue}</p>
            </div>
            <div className="search-bar-autocomplete-card">
              <div className="d-flex align-center">
                <div className="search-bar-avatar margin-inline-end-3">
                  <img
                    className="radius-circle"
                    src="./images/no-avatar.svg"
                    alt=""
                  />
                </div>
                <div>
                  <p className="fs-400 clr-neutral-800 fw-bold">Name Twittle</p>
                  <p className="fs-300 clr-neutral-600">@username</p>
                </div>
              </div>
            </div>
            <div className="search-bar-autocomplete-card">
              <div className="d-flex align-center">
                <div className="search-bar-avatar margin-inline-end-3">
                  <img
                    className="radius-circle"
                    src="./images/no-avatar.svg"
                    alt=""
                  />
                </div>
                <div>
                  <p className="fs-400 clr-neutral-800 fw-bold">Name Twittle</p>
                  <p className="fs-300 clr-neutral-600">@username</p>
                </div>
              </div>
            </div>
            <div className="search-bar-autocomplete-card">
              <div className="d-flex align-center">
                <div className="search-bar-avatar margin-inline-end-3">
                  <img
                    className="radius-circle"
                    src="./images/no-avatar.svg"
                    alt=""
                  />
                </div>
                <div>
                  <p className="fs-400 clr-neutral-800 fw-bold">Name Twittle</p>
                  <p className="fs-300 clr-neutral-600">@username</p>
                </div>
              </div>
            </div>
            <p className="fs-200 clr-neutral-800">{"go to @" + searchValue}</p>
          </>
        ) : (
          <div>
            <p className="clr-neutral-600 text-center">
              Try searching for people
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  setIsSearchClicked: PropTypes.func,
};

export default SearchBar;
