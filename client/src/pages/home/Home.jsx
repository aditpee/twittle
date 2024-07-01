import { Create } from "@mui/icons-material";
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

const Home = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });

  const [posts, setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  // infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          API_URL + "/api/posts/all?offset=0&limit=4"
        );
        setPosts(res.data);
        res.data.length < 4 ? setHasMore(false) : setHasMore(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const fetchMoreData = async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/all?offset=${index}&limit=4`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setIndex((prevIndex) => prevIndex + 1);

      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="home grid-container">
      {!isPhoneScreen && (
        <Suspense fallback={<Loader isCenterPage={true} />}>
          <LeftBar user={user} />
        </Suspense>
      )}
      <section className="home-content border-inline padding-block-end-10">
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
            <div className="pointer active">
              <p>For you</p>
            </div>
            <div className="pointer">
              <p>Following</p>
            </div>
          </div>
        </nav>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loader />}
        >
          <section className="timelines">
            <PostForm setPosts={setPosts} />
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </section>
        </InfiniteScroll>
        {isPhoneScreen && (
          <>
            <MobileNav scrollDir={scrollDir} />
            <MobilePost />
          </>
        )}
      </section>
      {isDesktopScreen && <RightBar />}
    </main>
  );
};

export default Home;
