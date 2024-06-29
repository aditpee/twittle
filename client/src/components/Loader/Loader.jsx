import { LoaderIcon } from "../../utils/icons/icons";
import "./loader.scss";
import PropTypes from "prop-types";

const Loader = ({ isCenterPage }) => {
  return (
    <div className={`loader ${isCenterPage ? "loader-center" : ""}`}>
      <div className="loader-container">
        <LoaderIcon />
      </div>
    </div>
  );
};

Loader.propTypes = {
  isCenterPage: PropTypes.bool,
};

export default Loader;
