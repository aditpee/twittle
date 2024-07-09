import { ArrowBack, Link as LinkIcon } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { useState, useContext } from "react";
import useDetectScroll from "@smakss/react-scroll-direction";
import MobileMenu from "../../components/mobile-menu/MobileMenu";
import MobileNav from "../../components/mobile-nav/MobileNav";
import Post from "../../components/post/Post";
import SiteHeader from "../../components/site-header/SiteHeader";
import "./profile.scss";
import LeftBar from "../../components/left-bar/LeftBar";
import RightBar from "../../components/right-bar/RightBar";
import { Date as DateIcon, Location } from "../../utils/icons/icons";
import { AuthContext } from "../../context/AuthContext";
import { API_URL, PF } from "../../config";
import { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import MobilePost from "../../components/mobile-post/MobilePost";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../components/Loader/Loader";
import useFormatTime from "../../utils/hooks/useFormatTime";
import { useCallback } from "react";
import PostModal from "../../components/post-modal/PostModal";
import EditProfile from "../../components/edit-profile/EditProfile";
import PostReply from "../../components/post/PostReply";

const Profile = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [user, setUser] = useState(null);
  const { username, page } = useParams();
  const navigate = useNavigate();
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(true);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const { scrollDir } = useDetectScroll({ thr: 100 });
  const { getMonth, getYear } = useFormatTime();

  const { user: currentUser, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [replyPosts, setReplyPosts] = useState([]);

  // infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

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

      // check is follow or unfollow
      if (followers.includes(currentUser._id)) {
        // unfollow
        setFollowers((prev) => prev.filter((id) => id !== currentUser._id));
      } else {
        // follow
        setFollowers((prev) => [...prev, currentUser._id]);
      }
    } catch (err) {
      setIsLoadingFollow(false);
      console.log(err);
    }
  };

  const fetchMoreDataPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts?offset=${index}&limit=10&userId=${user?._id}`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, user?._id]);

  const fetchMoreDataPostsMedia = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/media?offset=${index}&limit=9&userId=${user?._id}`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, user?._id]);

  const fetchMoreDataPostsLike = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/like?offset=${index}&limit=10&userId=${user?._id}`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, user?._id]);
  const fetchMoreDataPostsReplies = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/comments?offset=${index}&limit=10&userId=${user?._id}`,
        { headers: { Authorization: token } }
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, user?._id, token]);

  // ==== PREFILL =======

  // const fetchPrefill = useCallback(
  //   (callbackFetchMoreData) => {
  //     if (document.body.clientHeight <= window.innerHeight && hasMore) {
  //       callbackFetchMoreData();
  //     }
  //   },
  //   [hasMore]
  // );

  // useEffect(() => {
  //   if (!page) fetchPrefill(fetchMoreDataPosts);
  //   if (page === "media") fetchPrefill(fetchMoreDataPostsMedia);
  //   if (page === "likes") fetchPrefill(fetchMoreDataPostsLike);
  // }, [
  //   page,
  //   fetchPrefill,
  //   fetchMoreDataPosts,
  //   fetchMoreDataPostsMedia,
  //   fetchMoreDataPostsLike,
  // ]);

  useEffect(() => {
    if (page !== "replies" && page !== "media" && page !== "likes") {
      navigate(`/${username}`);
    }
    setIndex(1);
    setPosts([]);
    setHasMore(true);
  }, [page, navigate, username]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPage(true);
      try {
        // get user
        const res = await axios.get(
          API_URL + `/api/users?username=${username}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // get post
        let resPosts;
        if (page === "media") {
          resPosts = await axios.get(
            API_URL + "/api/posts/media?offset=0&limit=9&userId=" + res.data._id
          );
          setPosts(resPosts.data);
          resPosts.data.length < 9 ? setHasMore(false) : setHasMore(true);
        } else if (page === "likes") {
          resPosts = await axios.get(
            API_URL + "/api/posts/like?offset=0&limit=10&userId=" + res.data._id
          );
          setPosts(resPosts.data);
          resPosts.data.length < 10 ? setHasMore(false) : setHasMore(true);
        } else if (page === "replies") {
          resPosts = await axios.get(
            API_URL + "/api/comments?offset=0&limit=10&userId=" + res.data._id,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setPosts(resPosts.data);
          resPosts.data.length < 10 ? setHasMore(false) : setHasMore(true);
        } else {
          resPosts = await axios.get(
            API_URL + "/api/posts?offset=0&limit=10&userId=" + res.data._id
          );
          setPosts(resPosts.data);
          resPosts.data.length < 10 ? setHasMore(false) : setHasMore(true);
        }

        setUser(res.data);
        setFollowers(res.data.followers);
        setFollowings(res.data.followings);
        // check is follwed user
        if (res.data.followers.includes(currentUser._id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
        setIsLoadingPage(false);
      } catch (error) {
        setIsLoadingPage(false);
        console.log(error);
      }
    };
    fetchData();
  }, [token, username, currentUser, page]);

  const ProfileEmpty = ({ title, subTitle }) => (
    <div className="profile-empty">
      <h1
        className="clr-neutral-800 fw-black margin-block-end-2"
        style={{ fontSize: "2rem" }}
      >
        {title}
      </h1>
      <p className="fs-300 clr-neutral-600">{subTitle}</p>
    </div>
  );

  ProfileEmpty.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
  };

  return (
    <>
      <main className="profile grid-container">
        <EditProfile
          showModal={showModalEdit}
          setShowModal={setShowModalEdit}
          user={currentUser}
        />
        <PostModal
          showModal={showModalPost}
          setShowModal={setShowModalPost}
          setPosts={setPosts}
        />
        {!isPhoneScreen && (
          <LeftBar user={currentUser} setShowModal={setShowModalPost} />
        )}
        <section className="profile-content border-inline padding-block-end-10">
          <header
            className={`${scrollDir === "down" ? "hidden" : ""} profile-header`}
          >
            <Link to={-1}>
              <ArrowBack />
            </Link>
            <div className="profile-header-content padding-block-1">
              <p className="fs-400 fw-bold">{user?.name}</p>
              <span className="fs-200 clr-neutral-600">0 posts</span>
            </div>
          </header>
          <div className="profile-info">
            <div className="profile-cover">
              <div className="profile-cover-img">
                {user?.cover ? (
                  <img src={user.cover} alt="" />
                ) : (
                  <div className="no-profile-cover"></div>
                )}
              </div>
              <div className="profile-avatar">
                <img
                  src={
                    user?.avatar ? user.avatar : `${PF}/images/no-avatar.svg`
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="profile-info-content">
              <div className="profile-edit-button">
                {currentUser.username === user?.username ? (
                  <button
                    onClick={() => setShowModalEdit(true)}
                    className="fs-400 fw-bold"
                  >
                    Edit profile
                  </button>
                ) : isFollowed ? (
                  <button
                    disabled={isLoadingFollow}
                    onClick={handleFollow}
                    className="fs-400 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    disabled={isLoadingFollow}
                    onClick={handleFollow}
                    className="fs-400 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2"
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="profile-name">
                <p className="fs-500 fw-bold">{user?.name}</p>
                <p className="clr-neutral-600">{user?.username}</p>
              </div>
              <div className="profile-desc margin-block-3">
                <p>{user?.bio}</p>
              </div>
              <div className="profile-small-info">
                {user?.location && (
                  <div className="profile-location clr-neutral-600">
                    <Location />
                    <p>{user.location}</p>
                  </div>
                )}
                {user?.website && (
                  <div className="profile-link clr-neutral-600">
                    <LinkIcon />
                    <a href={user.website}>{user.website}</a>
                  </div>
                )}
                <div className="profile-date clr-neutral-600">
                  <DateIcon />
                  {user?.createdAt && (
                    <p>{`Joined ${getMonth(user.createdAt)} ${getYear(
                      user.createdAt
                    )}`}</p>
                  )}
                </div>
              </div>
              <div className="profile-info-follow">
                <div className="">
                  <p className="clr-neutral-600">
                    <span className="clr-neutral-800 fw-bold">
                      {followings.length}
                    </span>{" "}
                    Following
                  </p>
                </div>
                <div className="">
                  <p className="clr-neutral-600">
                    <span className="clr-neutral-800 fw-bold">
                      {followers.length}
                    </span>{" "}
                    Followers
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="profile-nav">
            <Link to={`/${user?.username}`}>
              <Button
                // onClick={() => setIndex(1)}
                className="profile-nav-button"
              >
                <div className="active">
                  <span className={`fs-400 fw-medium clr-neutral-600 active`}>
                    Posts
                  </span>
                </div>
              </Button>
            </Link>
            <Link to={`/${user?.username}/replies`}>
              <Button
                // onClick={() => setIndex(1)}
                className="profile-nav-button"
              >
                <div>
                  <span className={`fs-400 fw-medium clr-neutral-600`}>
                    Replies
                  </span>
                </div>
              </Button>
            </Link>
            <Link to={`/${user?.username}/media`}>
              <Button
                // onClick={() => setIndex(1)}
                className="profile-nav-button"
              >
                <div>
                  <span className={`fs-400 fw-medium clr-neutral-600`}>
                    Media
                  </span>
                </div>
              </Button>
            </Link>
            <Link to={`/${user?.username}/likes`}>
              <Button
                // onClick={() => setIndex(1)}
                className="profile-nav-button"
              >
                <div>
                  <span className={`fs-400 fw-medium clr-neutral-600`}>
                    Likes
                  </span>
                </div>
              </Button>
            </Link>
          </nav>
          <div className="profile-posts">
            {!page &&
              (posts.length === 0 && !isLoadingPage ? (
                username === currentUser.username ? (
                  <ProfileEmpty
                    title={"You don’t have any posts yet"}
                    subTitle={`When you do, your posts will show up here.`}
                  />
                ) : (
                  <ProfileEmpty
                    title={"This account don’t have any posts yet"}
                    subTitle={`When they do, their posts will show up here.`}
                  />
                )
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchMoreDataPosts}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollThreshold={0.5}
                >
                  <div>
                    {posts.map((post) => (
                      <Post key={post._id} post={post} />
                    ))}
                  </div>
                </InfiniteScroll>
              ))}
            {page === "media" &&
              (posts.length === 0 && !isLoadingPage ? (
                username === currentUser.username ? (
                  <ProfileEmpty
                    title={"Lights, camera … attachments!"}
                    subTitle={`When you post photos or videos, they will show up here.`}
                  />
                ) : (
                  <ProfileEmpty
                    title={"This account don’t have any media yet"}
                    subTitle={`When they do, their media will show up here.`}
                  />
                )
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchMoreDataPostsMedia}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollThreshold={0.5}
                >
                  <div className="profile-posts-media">
                    {posts.map((post) => (
                      <div key={post._id}>
                        <img src={post.image} alt="" />
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              ))}
            {page === "likes" &&
              (posts.length === 0 && !isLoadingPage ? (
                username === currentUser.username ? (
                  <ProfileEmpty
                    title={"You don’t have any likes yet"}
                    subTitle={`Tap the heart on any post to show it some love. When you do, it’ll show up here.`}
                  />
                ) : (
                  <ProfileEmpty
                    title={"This account don’t have any likes yet"}
                    subTitle={`When they do, it will show up here.`}
                  />
                )
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchMoreDataPostsLike}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollThreshold={0.5}
                >
                  <div>
                    {posts.map((post) => (
                      <Post key={post._id} post={post} />
                    ))}
                  </div>
                </InfiniteScroll>
              ))}
            {page === "replies" &&
              (posts.length === 0 && !isLoadingPage ? (
                username === currentUser.username ? (
                  <ProfileEmpty
                    title={"You don’t have any replies yet"}
                    subTitle={`When you do, your replies will show up here.`}
                  />
                ) : (
                  <ProfileEmpty
                    title={"This account don’t have any replies yet"}
                    subTitle={`When they do, their replies will show up here.`}
                  />
                )
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchMoreDataPostsReplies}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollThreshold={0.5}
                >
                  <div>
                    {posts.map((post) => (
                      <PostReply key={post._id} replyPost={post} />
                    ))}
                  </div>
                </InfiniteScroll>
              ))}
            {/* <div className="post-reply"></div> */}

            {/* <div className="profile-posts-media">
              <div>
                <img src="./images/post-img-2.png" alt="" />
              </div>
              <div>
                <img src="./images/post-img-2.png" alt="" />
              </div>
              <div>
                <img src="./images/post-img-2.png" alt="" />
              </div>
              <div>
                <img src="./images/post-img-2.png" alt="" />
              </div>
            </div> */}
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
    </>
  );
};

export default Profile;
