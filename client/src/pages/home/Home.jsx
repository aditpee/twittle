import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import { lazy } from "react";
import useDetectScroll from "@smakss/react-scroll-direction";
import InfiniteScroll from "react-infinite-scroll-component";

import MobileMenu from "../../components/mobile-menu/MobileMenu";
import MobileNav from "../../components/mobile-nav/MobileNav";
import Post from "../../components/post/Post";
import SiteHeader from "../../components/site-header/SiteHeader";
import "./home.scss";
// import LeftBar from "../../components/left-bar/LeftBar";
const LeftBar = lazy(() => import("../../components/left-bar/LeftBar"));
import RightBar from "../../components/right-bar/RightBar";
import PostForm from "../../components/post-form/PostForm";
import MobilePost from "../../components/mobile-post/MobilePost";
import { Suspense } from "react";
import PostModal from "../../components/post-modal/PostModal";
import { useCallback } from "react";
import { useRef } from "react";
import PageEmpty from "../../components/page-emtpy/PageEmpty";

const Home = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });
  const [showModalPost, setShowModalPost] = useState(false);
  const [isPostAll, setIsPostAll] = useState(true);

  const [posts, setPosts] = useState([]);
  const homeRef = useRef();

  const { user, token } = useContext(AuthContext);

  // infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  const fetchData = useCallback(async () => {
    window.scrollTo(0, 0);
    setIndex(1);
    setPosts([]);
    try {
      const res = await axios.get(API_URL + "/api/posts/all?offset=0&limit=10");
      setPosts(res.data);
      res.data.length < 10 ? setHasMore(false) : setHasMore(true);

      if (!user.followings.length) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchDataFollow = useCallback(async () => {
    window.scrollTo(0, 0);
    setIndex(1);
    setPosts([]);
    try {
      const res = await axios.get(
        API_URL + `/api/posts/follow?offset=0&limit=10`,
        { headers: { Authorization: token } }
      );
      setPosts(res.data);

      res.data.length < 10 ? setHasMore(false) : setHasMore(true);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const fetchMoreData = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/all?offset=${index}&limit=10`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex(index + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index]);

  const fetchMoreDataFollow = useCallback(async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/follow?offset=${index}&limit=10`,
        { headers: { Authorization: token } }
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex(index + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  }, [index, token]);

  // prefill when post not react at bottom of page

  // useEffect(() => {
  //   if (document.body.clientHeight <= window.innerHeight && hasMore) {
  //     fetchMoreData();
  //   }
  // }, [fetchMoreData, hasMore]);

  useEffect(() => {
    fetchData();
    isPostAll ? fetchData() : fetchDataFollow();
  }, [fetchData, fetchDataFollow, isPostAll]);

  return (
    <main ref={homeRef} className="home grid-container">
      <PostModal
        showModal={showModalPost}
        setShowModal={setShowModalPost}
        setPosts={setPosts}
      />
      {!isPhoneScreen && (
        <Suspense fallback={<Loader isCenterPage={true} />}>
          <LeftBar user={user} setShowModal={setShowModalPost} />
        </Suspense>
      )}
      <section
        id="home-scrollable"
        className="home-content border-inline padding-block-end-10"
      >
        <MobileMenu
          isMenuHidden={isMenuHidden}
          setIsMenuHidden={setIsMenuHidden}
          user={user}
        />
        <nav
          className={`${
            scrollDir === "down" ? "hidden" : ""
          } home-nav clr-neutral-600`}
        >
          {isPhoneScreen && (
            <SiteHeader type="logo" setIsMenuHidden={setIsMenuHidden} />
          )}
          <div className="home-nav-container">
            <div
              onClick={() => setIsPostAll(true)}
              className={`pointer ${isPostAll ? "active clr-neutral-800" : ""}`}
            >
              <p>For you</p>
            </div>
            <div
              onClick={() => setIsPostAll(false)}
              className={`pointer ${
                !isPostAll ? "active clr-neutral-800" : ""
              }`}
            >
              <p>Following</p>
            </div>
          </div>
        </nav>
        {user.followings.length ||
          (isPostAll && (
            <InfiniteScroll
              // scrollableTarget={"home-scrollable"}
              dataLength={posts.length}
              next={isPostAll ? fetchMoreData : fetchMoreDataFollow}
              hasMore={hasMore}
              loader={<Loader />}
              scrollThreshold={0.5}
            >
              <section className="timelines">
                {!isPhoneScreen && <PostForm setPosts={setPosts} />}
                {posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))}
              </section>
            </InfiniteScroll>
          ))}
        {!user.followings.length && (
          <PageEmpty
            title={`Welcome to Twittle!`}
            subTitle={`This is the best place to see what’s happening in your world. Find some people and topics to follow now.`}
          />
        )}
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

export default Home;
