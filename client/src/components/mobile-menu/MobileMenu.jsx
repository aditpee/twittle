import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PF } from "../../config";
import {
  ProfileOutline,
  BookmarkOutline,
  MoreRoundOutline,
} from "../../utils/icons/icons";
import "./mobile-menu.scss";

const MobileMenu = ({ isMenuHidden, setIsMenuHidden, user }) => {
  return (
    <div className={isMenuHidden ? "mobile-menu hidden" : "mobile-menu"}>
      <div
        className="mobile-menu-outside"
        onClick={() => setIsMenuHidden(true)}
      ></div>
      <div className="mobile-menu-container">
        <div>
          <div className="mobile-menu-avatar">
            <img src={PF + "/images/no-avatar.svg"} alt="" />
          </div>
          <div className="mobile-menu-name">
            <p className="fs-400 clr-neutral-800 fw-bold">{user.name}</p>
            <p className="clr-neutral-600">@{user.username}</p>
          </div>
          <div className="mobile-menu-info fs-300">
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                {user.followings.length}
              </span>
              Following
            </p>
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                {user.followers.length}
              </span>
              Followers
            </p>
          </div>
        </div>
        <div>
          <Link to={`/${user.username}`}>
            <div className="fs-500">
              <ProfileOutline />
              <h4>Profile</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link to={"/bookmarks"}>
            <div className="fs-500">
              <BookmarkOutline />
              <h4>Bookmarks</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link>
            <div className="fs-500">
              <MoreRoundOutline />
              <h4>More</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isMenuHidden: PropTypes.bool,
  setIsMenuHidden: PropTypes.func,
  user: PropTypes.object,
};

export default MobileMenu;
