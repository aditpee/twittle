import { Link as LinkIcon } from "@mui/icons-material";
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
import { ArrowBack, Date as DateIcon, Location } from "../../utils/icons/icons";
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
import UserCard from "../../components/user-card/UserCard";
import PageEmpty from "../../components/page-emtpy/PageEmpty";

const Profile = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [user, setUser] = useState(null);
  const { username, page } = useParams();
  const navigate = useNavigate();
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showModalPost, setShowModalPost] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const { scrollDir } = useDetectScroll({ thr: 100 });

  const { user: currentUser, token, dispatch } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [replyPosts, setReplyPosts] = useState([]);

  const { getMonth, getYear } = useFormatTime(user?.createdAt);

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
        dispatch({
          type: "UNFOLLOW",
          oldFollower: user?._id,
        });
      } else {
        // follow
        setFollowers((prev) => [...prev, currentUser._id]);
        dispatch({
          type: "FOLLOW",
          newFollower: user?._id,
        });
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

  const fetchMoreDataFollowers = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/users/${username}/followers?offset=${index}&limit=30`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, username]);
  const fetchMoreDataVerifFollowers = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL +
          `/api/users/${username}/verified_followers?offset=${index}&limit=30`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, username]);
  const fetchMoreDataFollowings = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/users/${username}/followings?offset=${index}&limit=30`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, username]);

  useEffect(() => {
    if (
      page !== "replies" &&
      page !== "media" &&
      page !== "likes" &&
      page !== "followings" &&
      page !== "verified_followers" &&
      page !== "followers"
    ) {
      navigate(`/${username}`, { replace: true });
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
        } else if (page === "followers") {
          resPosts = await axios.get(
            API_URL + `/api/users/${username}/followers?offset=0&limit=30`
          );
          setPosts(resPosts.data);
          resPosts.data.length < 30 ? setHasMore(false) : setHasMore(true);
        } else if (page === "verified_followers") {
          resPosts = await axios.get(
            API_URL +
              `/api/users/${username}/verified_followers?offset=0&limit=30`
          );
          setPosts(resPosts.data);
          resPosts.data.length < 30 ? setHasMore(false) : setHasMore(true);
        } else if (page === "followings") {
          resPosts = await axios.get(
            API_URL + `/api/users/${username}/followings?offset=0&limit=30`
          );
          setPosts(resPosts.data);
          resPosts.data.length < 30 ? setHasMore(false) : setHasMore(true);
        } else {
          resPosts = await axios.get(
            API_URL + "/api/posts?offset=0&limit=10&userId=" + res.data._id
          );
          setPosts(resPosts.data);
          resPosts.data.length < 10 ? setHasMore(false) : setHasMore(true);
        }

        setUser(res.data);
        setFollowers(res.data.followers);
        // check is follwed user
        if (res.data.followers.includes(currentUser._id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
        setIsLoadingPage(false);
      } catch (error) {
        setUser({ name: `@${username}`, notFound: true });
        setIsLoadingPage(false);
        console.log(error);
      }
    };
    fetchData();
  }, [token, username, currentUser._id, page]);

  // const PageEmpty = ({ title, subTitle }) => (
  //   <div className="profile-empty">
  //     <h1
  //       className="clr-neutral-800 fw-black margin-block-end-2"
  //       style={{ fontSize: "2rem" }}
  //     >
  //       {user?.notFound ? "This account doesn’t exist" : title}
  //     </h1>
  //     <p className="fs-300 clr-neutral-600">
  //       {user?.notFound ? "Try searching for another." : subTitle}
  //     </p>
  //   </div>
  // );

  // PageEmpty.propTypes = {
  //   title: PropTypes.string,
  //   subTitle: PropTypes.string,
  // };
  const testUser = {
    avatar:
      "https://res.cloudinary.com/dlovbdzns/image/upload/v1720259866/pzeteldl2meahirx5ltz.jpg",
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab velit expedita debitis nostrum suscipit, iste provident nobis minus itaque maiores earum nisi explicabo quos inventore adipisci mollitia sequi veniam temporibus dolores vero eum quae? Cupiditate ex dolor impedit vero doloribus sint, magni ea libero praesentium, soluta cumque consectetur possimus illum.",
    cover:
      "https://res.cloudinary.com/dlovbdzns/image/upload/v1720375217/hgrw3boq0d8fxwgsgvhb.jpg",
    createdAt: "2024-06-29T07:26:47.561Z",
    email: "p254881@gmail.com",
    followers: [],
    followings: [],
    location: "",
    name: "Aditya Pratama",
    password: "$2b$10$yB6fworxs9HCR2U9mTkv9.pCxf4wGgG4jGnmTqkVhx6qutNqRWG8C",
    updatedAt: "2024-07-12T11:57:14.805Z",
    username: "aditpee",
    verifiedAccount: true,
    verifiedEmail: true,
    website: "portofolio.com",
    __v: 0,
    _id: "667fb7373d36a59b783d1e02",
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
            <Link className="clr-neutral-800" to={-1}>
              <ArrowBack />
            </Link>
            <div className="profile-header-content padding-block-1">
              <p className="fs-400 clr-neutral-800 fw-bold">{user?.name}</p>
              <span className="fs-200 clr-neutral-600">0 posts</span>
            </div>
          </header>
          {page === "followers" ||
          page === "verified_followers" ||
          page === "followings" ? (
            <>
              <nav className="profile-nav">
                <Link to={`/${user?.username}/verified_followers`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "verified_followers"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span
                        style={{ textWrap: "nowrap" }}
                        className={`fs-400 fw-medium active`}
                      >
                        Verified Followers
                      </span>
                    </div>
                  </Button>
                </Link>
                <Link to={`/${user?.username}/followers`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "followers"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Followers</span>
                    </div>
                  </Button>
                </Link>
                <Link to={`/${user?.username}/followings`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "followings"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Followings</span>
                    </div>
                  </Button>
                </Link>
              </nav>
              <div>
                {page === "followers" &&
                  (posts.length === 0 && !isLoadingPage ? (
                    username === currentUser.username ? (
                      <PageEmpty
                        title={"Looking for followers?"}
                        subTitle={`When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={"Looking for followers?"}
                        subTitle={`When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.`}
                        notFound={user?.notFound}
                      />
                    )
                  ) : (
                    <InfiniteScroll
                      dataLength={posts.length}
                      next={fetchMoreDataFollowers}
                      hasMore={hasMore}
                      loader={<Loader />}
                      scrollThreshold={0.5}
                    >
                      <div>
                        {posts.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </div>
                    </InfiniteScroll>
                  ))}
                {page === "verified_followers" &&
                  (posts.length === 0 && !isLoadingPage ? (
                    username === currentUser.username ? (
                      <PageEmpty
                        title={"You don’t have any verified followers yet"}
                        subTitle={`When a verified account follows you, you’ll see them here.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={`@${username} doesn’t have any verified followers.`}
                        subTitle={`When someone verified follows this account, they’ll show up here.`}
                        notFound={user?.notFound}
                      />
                    )
                  ) : (
                    <InfiniteScroll
                      dataLength={posts.length}
                      next={fetchMoreDataVerifFollowers}
                      hasMore={hasMore}
                      loader={<Loader />}
                      scrollThreshold={0.5}
                    >
                      <div>
                        {posts.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </div>
                    </InfiniteScroll>
                  ))}
                {page === "followings" &&
                  (posts.length === 0 && !isLoadingPage ? (
                    username === currentUser.username ? (
                      <PageEmpty
                        title={`Be in the know`}
                        subTitle={`Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={`@${username} isn’t following anyone`}
                        subTitle={`Once they follow accounts, they’ll show up here.`}
                        notFound={user?.notFound}
                      />
                    )
                  ) : (
                    <InfiniteScroll
                      dataLength={posts.length}
                      next={fetchMoreDataFollowings}
                      hasMore={hasMore}
                      loader={<Loader />}
                      scrollThreshold={0.5}
                    >
                      <div>
                        {posts.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </div>
                    </InfiniteScroll>
                  ))}
              </div>
              {isPhoneScreen && (
                <>
                  <MobileNav scrollDir={scrollDir} />
                  <MobilePost setShowModal={setShowModalPost} />
                </>
              )}
            </>
          ) : (
            <>
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
                        user?.avatar
                          ? user.avatar
                          : `${PF}/images/no-avatar.svg`
                      }
                      alt=""
                    />
                  </div>
                </div>
                <div className="profile-info-content">
                  <div
                    style={{ visibility: user?.notFound ? "hidden" : "" }}
                    className="profile-edit-button"
                  >
                    {currentUser.username === user?.username ? (
                      <button
                        onClick={() => setShowModalEdit(true)}
                        className="fs-400 clr-neutral-800 fw-bold pointer"
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
                    <p className="fs-500 clr-neutral-800 fw-bold">
                      {user?.name}
                    </p>
                    <p className="clr-neutral-600">{user?.username}</p>
                  </div>
                  <div className="profile-desc margin-block-3 clr-neutral-800">
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
                        <a href={`//${user.website}`} target="_blank">
                          {user.website}
                        </a>
                      </div>
                    )}
                    <div
                      style={{ display: user?.notFound ? "none" : "" }}
                      className="profile-date clr-neutral-600"
                    >
                      <DateIcon />
                      {user?.createdAt && (
                        <p>{`Joined ${getMonth} ${getYear}`}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{ display: user?.notFound ? "none" : "" }}
                    className="profile-info-follow"
                  >
                    <div className="">
                      <Link to={`/${username}/followings`}>
                        <p className="clr-neutral-600">
                          <span className="clr-neutral-800 fw-bold">
                            {user?.followings?.length}
                          </span>{" "}
                          Following
                        </p>
                      </Link>
                    </div>
                    <div
                      style={{ display: user?.notFound ? "none" : "" }}
                      className=""
                    >
                      <Link to={`/${username}/followers`}>
                        <p className="clr-neutral-600">
                          <span className="clr-neutral-800 fw-bold">
                            {followers.length}
                          </span>{" "}
                          Followers
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <nav
                style={{ display: user?.notFound ? "none" : "" }}
                className="profile-nav margin-block-start-4"
              >
                <Link to={`/${user?.username}`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        !page ? "active clr-neutral-800" : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Posts</span>
                    </div>
                  </Button>
                </Link>
                <Link to={`/${user?.username}/replies`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "replies"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Replies</span>
                    </div>
                  </Button>
                </Link>
                <Link to={`/${user?.username}/media`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "media"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Media</span>
                    </div>
                  </Button>
                </Link>
                <Link to={`/${user?.username}/likes`}>
                  <Button
                    // onClick={() => setIndex(1)}
                    className="profile-nav-button"
                  >
                    <div
                      className={`${
                        page === "likes"
                          ? "active clr-neutral-800"
                          : "clr-neutral-600"
                      }`}
                    >
                      <span className={`fs-400 fw-medium`}>Likes</span>
                    </div>
                  </Button>
                </Link>
              </nav>
              <div className="profile-posts">
                {!page &&
                  (posts.length === 0 && !isLoadingPage ? (
                    username === currentUser.username ? (
                      <PageEmpty
                        title={"You don’t have any posts yet"}
                        subTitle={`When you do, your posts will show up here.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={"This account don’t have any posts yet"}
                        subTitle={`When they do, their posts will show up here.`}
                        notFound={user?.notFound}
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
                      <PageEmpty
                        title={"Lights, camera … attachments!"}
                        subTitle={`When you post photos or videos, they will show up here.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={"This account don’t have any media yet"}
                        subTitle={`When they do, their media will show up here.`}
                        notFound={user?.notFound}
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
                      <PageEmpty
                        title={"You don’t have any likes yet"}
                        subTitle={`Tap the heart on any post to show it some love. When you do, it’ll show up here.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={"This account don’t have any likes yet"}
                        subTitle={`When they do, it will show up here.`}
                        notFound={user?.notFound}
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
                      <PageEmpty
                        title={"You don’t have any replies yet"}
                        subTitle={`When you do, your replies will show up here.`}
                        notFound={user?.notFound}
                      />
                    ) : (
                      <PageEmpty
                        title={"This account don’t have any replies yet"}
                        subTitle={`When they do, their replies will show up here.`}
                        notFound={user?.notFound}
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
            </>
          )}
        </section>
        {isDesktopScreen && <RightBar />}
      </main>
    </>
  );
};

export default Profile;
