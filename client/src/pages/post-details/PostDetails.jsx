import { ArrowBack } from "@mui/icons-material";
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
import { Skeleton, useMediaQuery } from "@mui/material";
import useDetectScroll from "@smakss/react-scroll-direction";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeftBar from "../../components/left-bar/LeftBar";
import MobileNav from "../../components/mobile-nav/MobileNav";
import MobilePost from "../../components/mobile-post/MobilePost";
import PostModal from "../../components/post-modal/PostModal";
import PostMenu from "../../components/PostMenu/PostMenu";
import RightBar from "../../components/right-bar/RightBar";
import axios from "axios";
import { API_URL, PF } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import "./post-details.scss";
import { toast } from "react-toastify";
import useFormatTime from "../../utils/hooks/useFormatTime";
import Post from "../../components/post/Post";
import PostForm from "../../components/post-form/PostForm";

const PostDetails = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [likes, setLikes] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [showModalPost, setShowModalPost] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  const { scrollDir } = useDetectScroll({ thr: 100 });

  const { user: currentUser, token } = useContext(AuthContext);
  const { postId } = useParams();
  const { getTime, getFullDate } = useFormatTime();

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

  const handleFollow = async () => {
    setIsLoadingFollow(true);
    try {
      await axios.put(
        API_URL + `/api/users/${user.username}/follow`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setIsLoadingFollow(false);
      setIsFollowed((prev) => !prev);

      // // check is follow or unfollow
      // if (followers.includes(currentUser._id)) {
      //   // unfollow
      //   setFollowers((prev) => prev.filter((id) => id !== currentUser._id));
      // } else {
      //   // follow
      //   setFollowers((prev) => [...prev, currentUser._id]);
      // }
    } catch (err) {
      setIsLoadingFollow(false);
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
      navigate(-1);
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
    setIsLoadingPage(true);

    const fetchData = async () => {
      try {
        const resPost = await axios.get(API_URL + "/api/posts/" + postId);
        const resUser = await axios.get(
          API_URL + "/api/users?userId=" + resPost.data.userId,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setPost(resPost.data);
        setLikes(resPost.data.likes);
        setRetweets(resPost.data.retweets);

        setIsFollowed(resUser.data.followers.includes(currentUser._id));

        // check if we already like or retweet
        resPost.data.likes.includes(currentUser._id)
          ? setIsLiked(true)
          : setIsLiked(false);
        resPost.data.retweets.some((obj) => obj.userId === currentUser._id)
          ? setIsRetweeted(true)
          : setIsRetweeted(false);

        setUser(resUser.data);
        setIsLoadingPage(false);
      } catch (err) {
        setIsLoadingPage(false);
        console.log(err);
      }
    };
    fetchData();
  }, [postId, token, currentUser._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resComments = await axios.get(
          API_URL + "/api/comments?postId=" + postId,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(resComments.data);
        setComments(resComments.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId, token]);

  return (
    <main className="postdetails grid-container padding-block-end-10">
      <PostModal
        showModal={showModalPost}
        setShowModal={setShowModalPost}
        // setPosts={setPosts}
      />
      {!isPhoneScreen && (
        <LeftBar user={currentUser} setShowModal={setShowModalPost} />
      )}
      <section className="postdetails-content border-inline padding-block-end-10">
        <header
          className={`${
            scrollDir === "down" ? "hidden" : ""
          } postdetails-header padding-block-3`}
        >
          <Link to={-1} className="d-flex">
            <ArrowBack />
          </Link>
          <div className="postdetails-header-content">
            <p className="fs-400 fw-bold">Post</p>
          </div>
        </header>
        <div className="postdetails-body">
          <div className="postdetails-container postdetails-body-header">
            <div className="postdetails-avatar">
              {!isLoadingPage ? (
                <img
                  className="radius-circle hidden"
                  src={
                    user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"
                  }
                  alt=""
                />
              ) : (
                <Skeleton variant="circular" width={"100%"} height={"100%"} />
              )}
            </div>
            <div className="postdetails-body-header">
              {!isLoadingPage ? (
                <div>
                  <div className="postdetails-desc">
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
                    </div>
                  </div>
                  <div className="d-flex align-center">
                    {isFollowed ? (
                      <button
                        onClick={handleFollow}
                        disabled={isLoadingFollow}
                        className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-end-3"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        disabled={isLoadingFollow}
                        className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-end-3"
                      >
                        Follow
                      </button>
                    )}

                    <PostMenu
                      button={
                        <div className="postdetails-setting pointer">
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
                <Skeleton width={"70%"} />
              )}
            </div>
          </div>
          <div className="postdetails-body-main margin-block-start-4">
            {isLoadingPage && (
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
                <Skeleton
                  style={{ maxWidth: "250" }}
                  variant="rounded"
                  width={"min(100%, 400px)"}
                  height={150}
                />
              </>
            )}
            {!isLoadingPage && post?.text && (
              <p style={{ fontSize: "17px" }}>{post.text}</p>
            )}
            {!isLoadingPage && post?.image && (
              <div className="postdetails-img margin-block-start-3">
                <img src={post.image} alt="" />
              </div>
            )}
            <div className="postdetails-time clr-neutral-600 fs-300 margin-block-2">
              {!isLoadingPage ? (
                <time>{`${getTime(post?.createdAt)} · ${getFullDate(
                  post?.createdAt
                )}`}</time>
              ) : (
                <Skeleton width={"40%"} />
              )}
            </div>
          </div>
          <div className="postdetails-body-icon">
            {!isLoadingPage && (
              <>
                <div className="postdetails-comment pointer clr-neutral-600">
                  <div className="postdetails-icon d-flex">
                    <Comment />
                  </div>
                  <span className="fs-100 ">
                    {/* {postdetails.comments.length > 0 && postdetails.comments.length} */}
                    1
                  </span>
                </div>
                <div
                  onClick={handleRetweet}
                  className={`postdetails-retweet pointer ${
                    isRetweeted ? "clr-accent-teal" : "clr-neutral-600"
                  }`}
                >
                  <div className="postdetails-icon d-flex">
                    {isRetweeted ? <Repost /> : <RepostOutline />}
                  </div>
                  <span className="fs-100 ">
                    {retweets.length > 0 && retweets.length}
                  </span>
                </div>
                <div
                  onClick={handleLike}
                  className={`postdetails-like pointer ${
                    isLiked ? "clr-accent-pink" : "clr-neutral-600"
                  }`}
                >
                  <div className="postdetails-icon d-flex">
                    {isLiked ? <Love /> : <LoveOutline />}
                  </div>
                  <span className="fs-100 ">
                    {likes.length > 0 && likes.length}
                  </span>
                </div>
                <div className="postdetails-bookmark pointer clr-neutral-600">
                  <div className="postdetails-icon d-flex">
                    <Analytic />
                  </div>
                </div>
                <div className="postdetails-bookmark pointer clr-neutral-600">
                  <div className="postdetails-icon d-flex">
                    <BookmarkOutline />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {!isPhoneScreen && !isLoadingPage && <PostForm />}
        <div className="postdetails-comments">
          {comments.map((comment) => (
            <Post type="comments" key={comment._id} post={comment} />
          ))}
        </div>
        {isPhoneScreen && (
          <>
            <MobileNav scrollDir={scrollDir} />
            <MobilePost setShowModal={setShowModalPost} />
          </>
        )}
      </section>
      {isDesktopScreen && <RightBar />}
    </main>
  );
};

export default PostDetails;
