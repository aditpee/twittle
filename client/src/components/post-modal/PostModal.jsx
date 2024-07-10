import { ArrowBack } from "@mui/icons-material";
import PostForm from "../post-form/PostForm";
import Post from "../post/Post";
import "./post-modal.scss";
import PropTypes from "prop-types";
import { useRef } from "react";

const PostModal = ({
  showModal,
  setShowModal,
  setPosts,
  type,
  originPost,
  textButton,
  isModal,
}) => {
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
                {textButton || "Post"}
              </button>
            </div>
          </div>
          <div className="post-modal-modal-wrapper flow">
            <div className="post-modal-content">
              {type === "comments" && (
                <>
                  <Post post={originPost} />
                  <div className="post-modal-to">
                    <p className="clr-neutral-600">
                      Replying to{" "}
                      <a href="" className="clr-primary-000">
                        @username
                      </a>
                    </p>
                  </div>
                </>
              )}
              <PostForm
                type={type ? type : ""}
                textButton={textButton ? textButton : ""}
                setPosts={setPosts}
                setShowModal={setShowModal}
                postId={originPost ? originPost._id : ""}
                isModal={isModal ? true : false}
              />
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
  type: PropTypes.string,
  originPost: PropTypes.object,
  textButton: PropTypes.string,
  isModal: PropTypes.bool,
};

export default PostModal;
