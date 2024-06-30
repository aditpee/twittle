import { MoreHoriz } from "@mui/icons-material";
import { useRef, useState } from "react";
import { API_URL, PF } from "../../config";
import axios from "axios";
import {
  BookmarkOutline,
  Comment,
  Love,
  LoveOutline,
  Repost,
} from "../../utils/icons/icons";
import "./post.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import PropTypes from "prop-types";
import PostMenu from "../PostMenu/PostMenu";
import { toast } from "react-toastify";
import useTimeAgo from "../../utils/hooks/useFormatTime";

const Post = ({ post }) => {
  const [user, setUser] = useState(null);
  const { token, user: currentUser } = useContext(AuthContext);
  const postRef = useRef();
  const { timeAgo } = useTimeAgo();

  // to open dialog post menu
  const [openDialog, setOpenDialog] = useState(false);

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (likes?.includes(currentUser?._id)) {
      // remove id from likes
      setIsLiked(false);
      setLikes((prev) => prev.filter((id) => id !== currentUser._id));
    } else {
      // add id from likes
      setIsLiked(true);
      setLikes((prev) => [...prev, currentUser._id]);
    }
    try {
      await axios.put(
        API_URL + `/api/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      // remove id from likes
      setIsLiked(false);
      setLikes((prev) => prev.filter((id) => id !== currentUser._id));
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(API_URL + "/api/posts/" + post._id, {
        headers: {
          Authorization: token,
        },
      });
      postRef.current.style.display = "none";
      toast.success(res.data.message, {
        position: "bottom-center",
        theme: "colored",
        closeOnClick: false,
        pauseOnHover: false,
        hideProgressBar: true,
        autoClose: 5000,
        icon: false,
        closeButton: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          API_URL + "/api/users?userId=" + post.userId,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUser(res.data);
        if (post.likes.includes(currentUser._id)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [post.userId, token, currentUser._id, post.likes]);

  return (
    <div ref={postRef} className="post">
      <div className="post-avatar">
        <img
          className="radius-circle hidden"
          src={PF + "/images/no-avatar.svg"}
          alt=""
        />
      </div>
      <div className="post-content">
        <div>
          <div className="post-desc">
            <h4 className="fs-300 fw-bold clr-neutral-800">
              {user?.name || ""}
            </h4>
            <div>
              <span className="fs-300 clr-neutral-600">
                {`@${user?.username}` || ""}
              </span>
              <span>·</span>
              <span className="fs-300 clr-neutral-600">
                {timeAgo(new Date(post.createdAt))}
              </span>
            </div>
          </div>
          <div>
            <PostMenu
              button={<MoreHoriz className="post-setting pointer" />}
              handleDeletePost={handleDeletePost}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
            ></PostMenu>
          </div>
        </div>
        <div className="post-main">
          {post.text && (
            <p className="fs-300 clr-neutral-800">{post.text || ""}</p>
          )}
          {post.image && (
            <div className="post-img margin-block-start-3">
              <img src={post.image} alt="" />
            </div>
          )}
        </div>
        <div className="post-info">
          <div className="post-comment pointer clr-neutral-600">
            <div className="post-icon d-flex">
              <Comment />
            </div>
            <span className="fs-100 ">
              {post.comments.length > 0 && post.comments.length}
            </span>
          </div>
          <div className="post-retweet pointer clr-neutral-600">
            <div className="post-icon d-flex">
              <Repost />
            </div>
            <span className="fs-100 ">
              {post.retweets.length > 0 && post.retweets.length}
            </span>
          </div>
          <div
            onClick={handleLike}
            className={`post-like pointer ${
              isLiked ? "clr-accent-pink" : "clr-neutral-600"
            }`}
          >
            <div className="post-icon d-flex">
              {isLiked ? <Love /> : <LoveOutline />}
            </div>
            <span className="fs-100 ">{likes.length > 0 && likes.length}</span>
          </div>
          <div className="post-bookmark pointer clr-neutral-600">
            <div className="post-icon d-flex">
              <BookmarkOutline />
            </div>
          </div>
          <div className="post-bookmark pointer clr-neutral-600">
            <div className="post-icon d-flex">
              <BookmarkOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
