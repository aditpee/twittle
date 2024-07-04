import "./mobile-post.scss";
import PropTypes from "prop-types";

import { Tweet } from "../../utils/icons/icons";

const MobilePost = ({ setShowModal }) => {
  return (
    <div
      onClick={() => setShowModal(true)}
      className="mobile-post d-flex bg-primary-000 clr-neutral-000 radius-circle padding-3"
    >
      <Tweet />
    </div>
  );
};

MobilePost.propTypes = {
  setShowModal: PropTypes.func,
};

export default MobilePost;
