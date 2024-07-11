import { MoreHoriz } from "@mui/icons-material";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { API_URL, PF } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { SearchOutline } from "../../utils/icons/icons";
import SearchBar from "../search-bar/SearchBar";
import "./right-bar.scss";

const RightBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const { pathname } = useLocation();
  const [users, setUsers] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL + "/api/users?limit=2", {
          headers: {
            Authorization: token,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  console.log(users);

  return (
    <section className="right-bar">
      <div className="right-bar-container flow">
        {pathname !== "/explore" && (
          <div className="right-bar-search margin-block-start-2">
            <SearchBar />
          </div>
        )}
        <div className="right-bar-card">
          <div className="flow">
            <h4 className="fs-700">You might like</h4>
            {users.map((user) => (
              <div
                key={user._id}
                className="right-bar-follow-card d-flex align-center"
              >
                <div className="">
                  <div className="right-bar-avatar margin-inline-end-3">
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
                    <p className="fs-400 fw-bold">{user?.name}</p>
                    <p className="fs-300 clr-neutral-600">{`@${user?.username}`}</p>
                  </div>
                </div>
                <button className="fs-300 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2">
                  Following
                </button>
              </div>
            ))}
            <p className="fs-200 clr-primary-000">Show more</p>
          </div>
        </div>
        <div className="right-bar-card">
          <div className="flow">
            <h4 className="fs-700">Trends for you</h4>
            <div className="right-bar-trend-card margin-block-start-6">
              <div>
                <p className="fs-300 fw-bold">#trends2024</p>
                <p className="fs-100 clr-neutral-600">1247 posts</p>
              </div>
              <div className="right-bar-icon">
                <MoreHoriz className="clr-neutral-600" />
              </div>
            </div>
            <div className="right-bar-trend-card">
              <div>
                <p className="fs-300 fw-bold">#trends2024</p>
                <p className="fs-100 clr-neutral-600">1247 posts</p>
              </div>
              <div className="right-bar-icon">
                <MoreHoriz className="clr-neutral-600 fs-600" />
              </div>
            </div>
            <p className="fs-200 clr-primary-000">Show more</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightBar;
