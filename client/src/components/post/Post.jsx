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
  Verified,
} from "../../utils/icons/icons";
import "./post.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import PropTypes from "prop-types";
import PostMenu from "../PostMenu/PostMenu";
import { toast } from "react-toastify";
import useFormatTime from "../../utils/hooks/useFormatTime";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import PostModal from "../post-modal/PostModal";

const Post = ({ post, type }) => {
  const [user, setUser] = useState(null);
  const { token, user: currentUser } = useContext(AuthContext);
  const postRef = useRef();
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const { username } = useParams();

  const { timeAgo } = useFormatTime(
    post.isRetweet ? post.oldCreatedAt : post.createdAt
  );
  // to open dialog post menu
  const [openDialog, setOpenDialog] = useState(false);

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [retweets, setRetweets] = useState(post.retweets);
  const [isRetweeted, setIsRetweeted] = useState(false);

  const [comments, setComments] = useState([]);

  const [showModalComment, setShowModalComment] = useState(false);

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
        API_URL + `/api/${type || "posts"}/${post._id}/like`,
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
        API_URL + `/api/${type || "posts"}/${post._id}/retweet`,
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
      const res = await axios.delete(
        API_URL + `/api/${type || "posts"}/` + post._id,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      postRef.current.classList.add("remove");
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

        const resComment = await axios.get(
          API_URL +
            `/api/comments?offset=0&limit=${2 ** 31}&postId=` +
            post._id,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setComments(resComment.data);

        // check if we already like or retweet
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
    if (type === "theme") {
      setUser({ name: "Twittle", username: "twittle" });
      setIsLoadingPost(false);
    } else {
      fetchData();
    }
  }, [
    post.userId,
    token,
    currentUser._id,
    post.likes,
    post.retweets,
    post._id,
    type,
  ]);

  return (
    <>
      <PostModal
        showModal={showModalComment}
        setShowModal={setShowModalComment}
        type="comments"
        textButton="Reply"
        setPosts={setComments}
        originPost={post}
        isModal={true}
      />
      <div ref={postRef} className="post">
        {!isLoadingPost && post.isRetweet && (
          <div className="post-mark clr-neutral-600">
            <Repost />
            <p>
              {currentUser.username === username
                ? "You reposted"
                : `${username} reposted`}
            </p>
          </div>
        )}
        <Link className="post-container">
          <div className="post-avatar">
            {!isLoadingPost ? (
              <img
                className="radius-circle hidden"
                src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
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
                    <h4 className="fs-300 fw-bold clr-neutral-800 d-flex align-center">
                      <span>{user?.name || ""}</span>
                      {user?.verifiedAccount && (
                        <span className="verified-icon d-flex margin-inline-start-1">
                          <Verified />
                        </span>
                      )}
                    </h4>
                  </Link>
                  <div>
                    <Link to={`/${user?.username}`}>
                      <span className="fs-300 clr-neutral-600">
                        {`@${user?.username}` || ""}
                      </span>
                    </Link>
                    <span>·</span>
                    <Link to={`/${user?.username}/status/${post._id}`}>
                      <span className="fs-300 clr-neutral-600">{timeAgo}</span>
                    </Link>
                  </div>
                </div>
                {type !== "theme" && (
                  <div>
                    <PostMenu
                      postUser={user}
                      currentUser={currentUser}
                      button={
                        <div className="post-setting pointer">
                          <MoreHoriz />
                        </div>
                      }
                      handleDeletePost={handleDeletePost}
                      setOpenDialog={setOpenDialog}
                      openDialog={openDialog}
                      isHaveMobileStyle={true}
                    ></PostMenu>
                  </div>
                )}
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
            {!isLoadingPost && type !== "theme" && (
              <div className="post-info">
                <div
                  onClick={() => setShowModalComment(true)}
                  className="post-comment pointer clr-neutral-600"
                >
                  <div className="post-icon d-flex">
                    <Comment />
                  </div>
                  <span className="fs-100 ">
                    {comments.length > 0 && comments.length}
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
        </Link>
      </div>
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object,
  type: PropTypes.string,
};

export default Post;
