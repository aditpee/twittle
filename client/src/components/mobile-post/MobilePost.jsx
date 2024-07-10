import "./mobile-post.scss";
import PropTypes from "prop-types";

import { Comment, Tweet } from "../../utils/icons/icons";

const MobilePost = ({ setShowModal, type }) => {
  return (
    <div
      onClick={() => setShowModal(true)}
      className="mobile-post d-flex bg-primary-000 clr-neutral-000 radius-circle padding-3"
    >
      {type === "comments" ? <Comment /> : <Tweet />}
    </div>
  );
};

MobilePost.propTypes = {
  setShowModal: PropTypes.func,
  type: PropTypes.string,
};

export default MobilePost;
