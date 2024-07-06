import "./mobile-nav.scss";
import {
  HomeOutline,
  MessageOutline,
  NotificationOutline,
  SearchOutline,
} from "../../utils/icons/icons";
import PropTypes from "prop-types";
import { Link } from "@mui/material";

const MobileNav = ({ scrollDir }) => {
  return (
    <nav className={scrollDir === "down" ? "mobile-nav scroll" : "mobile-nav"}>
      <div className="mobile-nav-container">
        <Link to={"/home"}>
          <div className="home-icon d-flex clr-neutral-800">
            <HomeOutline />
          </div>
        </Link>
        <Link to={""}>
          <div className="explore-icon d-flex clr-neutral-800">
            <SearchOutline />
          </div>
        </Link>
        <Link to={""}>
          <div className="notif-icon d-flex clr-neutral-800">
            <NotificationOutline />
          </div>
        </Link>
        <Link to={""}>
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
