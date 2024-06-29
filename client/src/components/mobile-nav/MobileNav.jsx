import "./mobile-nav.scss";
import {
  HomeOutline,
  MessageOutline,
  NotificationOutline,
  SearchOutline,
} from "../../utils/icons/icons";
import PropTypes from "prop-types";

const MobileNav = ({ scrollDir }) => {
  return (
    <nav className={scrollDir === "down" ? "mobile-nav scroll" : "mobile-nav"}>
      <div className="mobile-nav-container">
        <div className="home-icon d-flex">
          <HomeOutline />
        </div>
        <div className="explore-icon d-flex">
          <SearchOutline />
        </div>
        <div className="notif-icon d-flex">
          <NotificationOutline />
        </div>
        <div className="message-icon d-flex">
          <MessageOutline />
        </div>
      </div>
    </nav>
  );
};

MobileNav.propTypes = {
  scrollDir: PropTypes.string,
};

export default MobileNav;
