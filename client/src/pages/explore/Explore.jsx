import { Create } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useDetectScroll from "@smakss/react-scroll-direction";

import MobileMenu from "../../components/mobile-menu/MobileMenu";
import MobileNav from "../../components/mobile-nav/MobileNav";
import Post from "../../components/post/Post";
import SiteHeader from "../../components/site-header/SiteHeader";
import "./explore.scss";
import LeftBar from "../../components/left-bar/LeftBar";
import RightBar from "../../components/right-bar/RightBar";
import PostForm from "../../components/post-form/PostForm";
import { AuthContext } from "../../context/AuthContext";
import PostModal from "../../components/post-modal/PostModal";
import { API_URL } from "../../config";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../components/Loader/Loader";

const Explore = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });
  const [showModalPost, setShowModalPost] = useState(false);

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  const { user } = useContext(AuthContext);

  const testPost = {
    bookmarks: [],
    comments: [],
    createdAt: "2024-06-28T07:54:21.861Z",
    image: "",
    likes: [],
    retweets: [],
    text: "for infinite scrolll\n\n\n\nfor infinite scrolll\n\n\n\n\nfor infinitescrolll\n",
    updatedAt: "2024-06-28T07:54:21.861Z",
    userId: "666b7c63c8af266e418767b9",
    __v: 0,
    _id: "667e6c2dcce20bf1a86a6192",
  };

  const fetchMoreData = async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/posts/all?offset=${index}&limit=10`
      );
      setIndex((prevIndex) => prevIndex + 1);
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          API_URL + "/api/posts/all?offset=0&limit=10"
        );
        setPosts(res.data);
        res.data.length < 10 ? setHasMore(false) : setHasMore(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <main className="explore grid-container">
        <PostModal
          showModal={showModalPost}
          setShowModal={setShowModalPost}
          // setPosts={setPosts}
        />
        {!isPhoneScreen && <LeftBar user={user} />}
        <section className="explore-content border-inline padding-block-end-10">
          <MobileMenu
            isMenuHidden={isMenuHidden}
            setIsMenuHidden={setIsMenuHidden}
            user={user}
          />
          <nav className={`explore-nav clr-neutral-600`}>
            <SiteHeader type="search" setIsMenuHidden={setIsMenuHidden} />
            <div className="explore-nav-container">
              <div className="pointer active">
                <p>Post</p>
              </div>
              <div className="pointer">
                <p>People</p>
              </div>
              <div className="pointer">
                <p>Media</p>
              </div>
            </div>
          </nav>
          <div className="profile-posts">
            <InfiniteScroll
              // scrollableTarget={"home-scrollable"}
              dataLength={posts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loader />}
              scrollThreshold={0.5}
            >
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </InfiniteScroll>
          </div>
        </section>
        {isDesktopScreen && <RightBar />}
      </main>
    </>
  );
};

export default Explore;
