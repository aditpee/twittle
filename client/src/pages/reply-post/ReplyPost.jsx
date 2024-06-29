import { ArrowBack } from "@mui/icons-material";
import PostForm from "../../components/post-form/PostForm";
import Post from "../../components/post/Post";
import "./reply-post.scss";

const ReplyPost = () => {
  return (
    <main className="reply-post">
      <div className="reply-post-modal">
        <div className="reply-post-header">
          <div className="reply-post-close">
            <ArrowBack />
          </div>
          <div className="reply-post-draft">
            <button className="fs-300 clr-primary-000 fw-bold">Draft</button>
            <button className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-primary-000 margin-inline-start-3">
              Reply
            </button>
          </div>
        </div>
        <div className="reply-post-modal-wrapper flow">
          <div className="reply-post-content">
            <Post />
            <div className="reply-post-to">
              <p className="clr-neutral-600">
                Replying to{" "}
                <a href="" className="clr-primary-000">
                  @username
                </a>
              </p>
            </div>
            <PostForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReplyPost;
