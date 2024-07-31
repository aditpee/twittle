import "./mobile-nav.scss";
import {
  HomeOutline,
  MessageOutline,
  NotificationOutline,
  SearchOutline,
} from "../../utils/icons/icons";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MobileNav = ({ scrollDir }) => {
  return (
    <nav className={scrollDir === "down" ? "mobile-nav scroll" : "mobile-nav"}>
      <div className="mobile-nav-container bg-neutral-000">
        <Link to={"/home"}>
          <div className="home-icon d-flex clr-neutral-800">
            <HomeOutline />
          </div>
        </Link>
        <Link to={"/explore"}>
          <div className="explore-icon d-flex clr-neutral-800">
            <SearchOutline />
          </div>
        </Link>
        <Link to={"/notification"}>
          <div className="notif-icon d-flex clr-neutral-800">
            <NotificationOutline />
          </div>
        </Link>
        <Link to={"/messages"}>
          <div className="message-icon d-flex clr-neutral-800">
            <MessageOutline />
          </div>
        </Link>
      </div>
    </nav>
  );
};

MobileNav.propTypes = {
  scrollDir: PropTypes.string,
};

export default MobileNav;
