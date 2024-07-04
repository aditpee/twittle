import { useRef, useState } from "react";
import { API_URL, PF } from "../../config";
import axios from "axios";
import {
  Analytic,
  BookmarkOutline,
  Comment,
  Love,
  LoveOutline,
  MoreHoriz,
  Repost,
  RepostOutline,
} from "../../utils/icons/icons";
import "./post.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import PropTypes from "prop-types";
import PostMenu from "../PostMenu/PostMenu";
import { toast } from "react-toastify";
import useTimeAgo from "../../utils/hooks/useFormatTime";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Skeleton } from "@mui/material";

const Post = ({ post }) => {
  const [user, setUser] = useState(null);
  const { token, user: currentUser } = useContext(AuthContext);
  const postRef = useRef();
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const { timeAgo } = useTimeAgo();

  // to open dialog post menu
  const [openDialog, setOpenDialog] = useState(false);

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [retweets, setRetweets] = useState(post.retweets);
  const [isRetweeted, setIsRetweeted] = useState(false);

  const handleLike = async () => {
    if (likes?.includes(currentUser?._id)) {
      console.log(postRef);
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

  const handleRetweet = async () => {
    if (retweets?.some((obj) => obj.userId === currentUser?._id)) {
      // remove id from likes
      setIsRetweeted(false);
      setRetweets((prev) =>
        prev.filter((obj) => obj.userId !== currentUser._id)
      );
    } else {
      // add id from likes
      setIsRetweeted(true);
      setRetweets((prev) => [
        ...prev,
        { userId: currentUser._id, tweetedAt: new Date().toISOString() },
      ]);
    }
    try {
      await axios.put(
        API_URL + `/api/posts/${post._id}/retweet`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      // remove id from likes
      setIsRetweeted(false);
      setRetweets((prev) =>
        prev.filter((obj) => obj.userId !== currentUser._id)
      );
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
    setIsLoadingPost(true);
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
        post.likes.includes(currentUser._id)
          ? setIsLiked(true)
          : setIsLiked(false);
        post.retweets.some((obj) => obj.userId === currentUser._id)
          ? setIsRetweeted(true)
          : setIsRetweeted(false);

        setIsLoadingPost(false);
      } catch (err) {
        setIsLoadingPost(false);
        console.log(err);
      }
    };
    fetchData();
  }, [post.userId, token, currentUser._id, post.likes, post.retweets]);

  return (
    <div ref={postRef} className="post">
      {!isLoadingPost && post.isRetweet && (
        <div className="post-mark">
          <Repost />
          <p>You reposted</p>
        </div>
      )}
      <div className="post-container">
        <div className="post-avatar">
          {!isLoadingPost ? (
            <img
              className="radius-circle hidden"
              src={PF + "/images/no-avatar.svg"}
              alt=""
            />
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}
        </div>
        <div className="post-content">
          {!isLoadingPost ? (
            <div>
              <div className="post-desc">
                <Link to={`/${user?.username}`}>
                  <h4 className="fs-300 fw-bold clr-neutral-800">
                    {user?.name || ""}
                  </h4>
                </Link>
                <div>
                  <Link to={`/${user?.username}`}>
                    <span className="fs-300 clr-neutral-600">
                      {`@${user?.username}` || ""}
                    </span>
                  </Link>
                  <span>·</span>
                  <span className="fs-300 clr-neutral-600">
                    {post.isRetweet
                      ? timeAgo(new Date(post.oldCreatedAt))
                      : timeAgo(new Date(post.createdAt))}
                  </span>
                </div>
              </div>
              <div>
                <PostMenu
                  button={
                    <div className="post-setting pointer">
                      <MoreHoriz />
                    </div>
                  }
                  handleDeletePost={handleDeletePost}
                  setOpenDialog={setOpenDialog}
                  openDialog={openDialog}
                ></PostMenu>
              </div>
            </div>
          ) : (
            <Skeleton width={"40%"} />
          )}
          <div className="post-main">
            {isLoadingPost && post.text && (
              <>
                <Skeleton
                  style={{ marginBottom: ".3rem" }}
                  variant="text"
                  width={"75%"}
                />
                <Skeleton
                  style={{ marginBottom: ".3rem" }}
                  variant="text"
                  width={"80%"}
                />
              </>
            )}
            {isLoadingPost && post.image && (
              <>
                <Skeleton
                  style={{ maxWidth: "200" }}
                  variant="rounded"
                  width={"min(100%, 400px)"}
                  height={150}
                />
              </>
            )}
            {!isLoadingPost && post.text && (
              <p className="fs-300 clr-neutral-800">{post.text || ""}</p>
            )}
            {!isLoadingPost && post.image && (
              <div className="post-img margin-block-start-3">
                <img src={post.image} alt="" />
              </div>
            )}
          </div>
          {!isLoadingPost && (
            <div className="post-info">
              <div className="post-comment pointer clr-neutral-600">
                <div className="post-icon d-flex">
                  <Comment />
                </div>
                <span className="fs-100 ">
                  {post.comments.length > 0 && post.comments.length}
                </span>
              </div>
              <div
                onClick={handleRetweet}
                className={`post-retweet pointer ${
                  isRetweeted ? "clr-accent-teal" : "clr-neutral-600"
                }`}
              >
                <div className="post-icon d-flex">
                  {isRetweeted ? <Repost /> : <RepostOutline />}
                </div>
                <span className="fs-100 ">
                  {retweets.length > 0 && retweets.length}
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
                <span className="fs-100 ">
                  {likes.length > 0 && likes.length}
                </span>
              </div>
              <div className="post-bookmark pointer clr-neutral-600">
                <div className="post-icon d-flex">
                  <Analytic />
                </div>
              </div>
              <div className="post-bookmark pointer clr-neutral-600">
                <div className="post-icon d-flex">
                  <BookmarkOutline />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
