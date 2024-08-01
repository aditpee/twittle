import "./mobile-nav.scss";
import {
  Home,
  HomeOutline,
  Message,
  MessageOutline,
  Notification,
  NotificationOutline,
  Search,
  SearchOutline,
} from "../../utils/icons/icons";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const MobileNav = ({ scrollDir }) => {
  const page = useLocation().pathname?.split("/")[1];
  const getPage = () => {
    switch (page) {
      case "home":
      case "bookmarks":
      case "message":
      case "explore":
        return page;
      default:
        return "";
    }
  };

  return (
    <nav className={scrollDir === "down" ? "mobile-nav scroll" : "mobile-nav"}>
      <div className="mobile-nav-container bg-neutral-000">
        <Link to={"/home"}>
          <div className="home-icon d-flex clr-neutral-800">
            {getPage() === "home" ? <Home /> : <HomeOutline />}
          </div>
        </Link>
        <Link to={"/explore"}>
          <div className="explore-icon d-flex clr-neutral-800">
            {getPage() === "explore" ? <Search /> : <SearchOutline />}
          </div>
        </Link>
        <Link to={"/notification"}>
          <div className="notif-icon d-flex clr-neutral-800">
            {getPage() === "notification" ? (
              <Notification />
            ) : (
              <NotificationOutline />
            )}
          </div>
        </Link>
        <Link to={"/messages"}>
          <div className="message-icon d-flex clr-neutral-800">
            {getPage() === "messages" ? <Message /> : <MessageOutline />}
          </div>
        </Link>
      </div>
    </nav>
  );
};

MobileNav.propTypes = {
  scrollDir: PropTypes.string,
  user: PropTypes.object,
};

export default MobileNav;
