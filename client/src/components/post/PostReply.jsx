import Post from "./Post";
import "./post.scss";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "../../config";
import { useEffect } from "react";
import { useState } from "react";

const PostReply = ({ replyPost }) => {
  const [ogPost, setOgPost] = useState(null);

  useEffect(() => {
    if (replyPost.postId) {
      try {
        const fetchData = async () => {
          const res = await axios.get(
            API_URL + "/api/posts/" + replyPost?.postId
          );

          setOgPost(res.data);
        };
        fetchData();
      } catch (err) {
        console.log(err);
      }
    }
  }, [replyPost.postId]);

  return (
    ogPost && (
      <div className="post-reply">
        <Post post={ogPost} />
        <Post type={"comments"} post={replyPost} />
      </div>
    )
  );
};

PostReply.propTypes = {
  replyPost: PropTypes.object,
};

export default PostReply;
