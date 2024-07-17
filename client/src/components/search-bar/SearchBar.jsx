import { Cancel } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useRef } from "react";
import useOutsideClick from "../../utils/hooks/useOutSideClick";
import { SearchOutline } from "../../utils/icons/icons";
import axios from "axios";
import "./search-bar.scss";
import { API_URL, PF } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = ({ setIsSearchClicked }) => {
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const { token } = useContext(AuthContext);
  const [searchUsers, setSearchUsers] = useState([]);
  const navigate = useNavigate();

  const debounced = useDebouncedCallback((e, fnCallback) => {
    fnCallback(e);
  }, 500);

  const handleNavigateSearch = (url) => {
    navigate(`/${url}`);
  };

  const handleClickOutside = () => {
    autoCompleteRef.current.classList.add("hide");
    setIsSearchClicked && setIsSearchClicked(false);
  };
  const handleClickInside = () => {
    autoCompleteRef.current && autoCompleteRef.current.classList.remove("hide");
    setIsSearchClicked && setIsSearchClicked(true);
  };
  const searchBarRef = useOutsideClick(handleClickOutside, handleClickInside);

  const handleSearch = async (e) => {
    if (!e.target.value) return;
    try {
      const res = await axios.get(
        API_URL + "/api/search?people=" + e.target.value,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(res.data);
      setSearchUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
            onChange={(e) => {
              setSearchUsers([]);
              debounced(e, handleSearch);
            }}
          />
        </div>
        <div
          className="search-bar-icon-cancel clr-primary-000 d-flex"
          onClick={() => {
            setSearchValue("");
            searchRef.current.focus();
          }}
        >
          <div
            className={`remove-search-icon d-flex ${searchValue ? "" : "hide"}`}
          >
            <Cancel hidden onClick={() => setIsSearchClicked(true)} />
          </div>
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
            {searchUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleNavigateSearch(user?.username)}
                className="search-bar-autocomplete-card"
              >
                <div className="d-flex align-center">
                  <div className="search-bar-avatar margin-inline-end-3">
                    <img
                      className="radius-circle"
                      src={
                        user?.avatar
                          ? user?.avatar
                          : PF + "/images/no-avatar.svg"
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="fs-400 clr-neutral-800 fw-bold">
                      {user?.name}
                    </p>
                    <p className="fs-300 clr-neutral-600">{`@${user?.username}`}</p>
                  </div>
                </div>
              </div>
            ))}
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
