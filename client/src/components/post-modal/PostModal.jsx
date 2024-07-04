import { ArrowBack } from "@mui/icons-material";
import PostForm from "../post-form/PostForm";
import "./post-modal.scss";
import PropTypes from "prop-types";
import { useRef } from "react";

const PostModal = ({ showModal, setShowModal, setPosts }) => {
  const modalRef = useRef();
  return (
    showModal && (
      <div
        ref={modalRef}
        onClick={(e) => {
          if (e.target === modalRef.current) setShowModal(false);
        }}
        className="post-modal"
      >
        <div className="post-modal-container">
          <div className="post-modal-header">
            <div
              onClick={() => setShowModal(false)}
              className="post-modal-close"
            >
              <ArrowBack />
            </div>
            <div className="post-modal-draft">
              <button className="fs-300 clr-primary-000 fw-bold">Draft</button>
              <button className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-primary-000 margin-inline-start-3">
                Post
              </button>
            </div>
          </div>
          <div className="post-modal-modal-wrapper flow">
            <div className="post-modal-content">
              {/* <Post /> */}
              {/* <div className="post-modal-to">
              <p className="clr-neutral-600">
                Replying to{" "}
                <a href="" className="clr-primary-000">
                  @username
                </a>
              </p>
            </div> */}
              <PostForm setPosts={setPosts} setShowModal={setShowModal} />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

PostModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  setPosts: PropTypes.func,
};

export default PostModal;
