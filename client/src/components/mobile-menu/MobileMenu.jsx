import { PaletteOutlined } from "@mui/icons-material";
import PropTypes from "prop-types";
import { PF } from "../../config";
import { ProfileOutline, BookmarkOutline } from "../../utils/icons/icons";
import "./mobile-menu.scss";

const MobileMenu = ({ isMenuHidden, setIsMenuHidden }) => {
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
            <p className="fs-400 clr-neutral-800 fw-bold">Name Twittle</p>
            <p className="clr-neutral-600">@username</p>
          </div>
          <div className="mobile-menu-info fs-300">
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                6
              </span>
              Following
            </p>
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                0
              </span>
              Followers
            </p>
          </div>
        </div>
        <div>
          <div className="fs-500">
            <ProfileOutline />
            <h4>Profile</h4>
          </div>
        </div>
        <div>
          <div className="fs-500">
            <BookmarkOutline />
            <h4>Bookmarks</h4>
          </div>
        </div>
        <div>
          <div className="fs-500">
            <PaletteOutlined />
            <h4>Display</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isMenuHidden: PropTypes.bool,
  setIsMenuHidden: PropTypes.func,
};

export default MobileMenu;
