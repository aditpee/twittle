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
import { useMediaQuery } from "@mui/material";
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

const PostDetails = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likes, setLikes] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const navigate = useNavigate();

  const [showModalPost, setShowModalPost] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

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

        // check if we already like or retweet
        resPost.data.likes.includes(currentUser._id)
          ? setIsLiked(true)
          : setIsLiked(false);
        resPost.data.retweets.some((obj) => obj.userId === currentUser._id)
          ? setIsRetweeted(true)
          : setIsRetweeted(false);

        setUser(resUser.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId, token, currentUser._id]);

  return (
    <main className="profile grid-container padding-block-end-10">
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
        <div className="postdetails-body padding-4">
          <div className="postdetails-container postdetails-body-header">
            <div className="postdetails-avatar">
              <img
                className="radius-circle hidden"
                src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
                alt=""
              />
            </div>
            <div className="postdetails-body-header">
              <div>
                <div className="postdetails-desc">
                  <Link to={``}>
                    <h4 className="fs-300 fw-bold clr-neutral-800">
                      {user?.name || ""}
                    </h4>
                  </Link>
                  <div>
                    <Link to={``}>
                      <span className="fs-300 clr-neutral-600">
                        {`@${user?.username}` || ""}
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="d-flex align-center">
                  <button className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-end-3">
                    Follow
                  </button>
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
            </div>
          </div>
          <div className="postdetails-body-main margin-block-start-4">
            {post?.text && <p style={{ fontSize: "17px" }}>{post.text}</p>}
            {post?.image && (
              <div className="postdetails-img margin-block-start-3">
                <img src={post.image} alt="" />
              </div>
            )}
            <div className="postdetails-time clr-neutral-600 fs-300 margin-block-2">
              <time>{`${getTime(post?.createdAt)} · ${getFullDate(
                post?.createdAt
              )}`}</time>
            </div>
          </div>
          <div className="postdetails-body-icon">
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
          </div>
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
