import "./mobile-post.scss";

import { Tweet } from "../../utils/icons/icons";

const MobilePost = () => {
  return (
    <div className="mobile-post d-flex bg-primary-000 clr-neutral-000 radius-circle padding-3">
      <Tweet />
    </div>
  );
};

export default MobilePost;
