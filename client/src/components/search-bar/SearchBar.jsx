import PropTypes from "prop-types";
import { useState } from "react";
import { useRef } from "react";
import useOutsideClick from "../../utils/hooks/useOutSideClick";
import { Cancel, SearchOutline } from "../../utils/icons/icons";
import axios from "axios";
import "./search-bar.scss";
import { API_URL, PF } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Verified } from "@mui/icons-material";

const SearchBar = ({ setIsSearchClicked, query }) => {
  const [searchValue, setSearchValue] = useState(query?.q ? query.q : "");
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

      setSearchUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClickOutside();
    searchRef.current.blur();
    navigate(`/explore?q=${searchValue}&f=${query.f}`);
  };

  return (
    <div className="search-bar bg-neutral-000" ref={searchBarRef}>
      <form onSubmit={handleSubmit} className="bg-neutral-400 clr-neutral-600">
        <div className="d-flex align-center">
          <button className="search-bar-icon d-flex margin-inline-end-2">
            <SearchOutline />
          </button>
          <input
            placeholder="Search"
            className="clr-neutral-800 fs-300"
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
            className={`remove-search-icon d-flex bg-primary-000 clr-neutral-000 ${
              searchValue ? "" : "hide"
            }`}
          >
            <Cancel hidden onClick={() => setIsSearchClicked(true)} />
          </div>
        </div>
      </form>
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
                    <div className="fs-400 clr-neutral-800 fw-bold d-flex align-center">
                      <p>{user?.name}</p>
                      {user?.verifiedAccount && (
                        <span className="verified-icon d-flex margin-inline-start-1">
                          <Verified />
                        </span>
                      )}
                    </div>
                    <p className="fs-300 clr-neutral-600">{`@${user?.username}`}</p>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <Link to={`/${searchValue}`} className="fs-200 clr-neutral-800">
                {"go to @" + searchValue}
              </Link>
            </div>
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
  query: PropTypes.object,
};

export default SearchBar;
