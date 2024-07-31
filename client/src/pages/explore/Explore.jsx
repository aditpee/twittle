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
import { Link, useSearchParams } from "react-router-dom";
import UserCard from "../../components/user-card/UserCard";
import MobilePost from "../../components/mobile-post/MobilePost";

const Explore = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });
  const [showModalPost, setShowModalPost] = useState(false);
  const [searchParams] = useSearchParams();
  const query = {
    q: searchParams.get("q") || "",
    f: searchParams.get("f") || "",
  };

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  const { user, token } = useContext(AuthContext);

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

  const fetchMoreDataPosts = async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/search/post?offset=${index}&limit=10&q=` + query.q,
        { headers: { Authorization: token } }
      );
      setIndex((prevIndex) => prevIndex + 1);
      setPosts((prev) => [...prev, ...res.data]);
      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchMoreDataPeople = async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/search/people?offset=${index}&limit=10&q=` + query.q,
        { headers: { Authorization: token } }
      );
      setIndex((prevIndex) => prevIndex + 1);
      setPosts((prev) => [...prev, ...res.data]);
      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchMoreDataMedia = async () => {
    try {
      const res = await axios.get(
        API_URL + `/api/search/media?offset=${index}&limit=10&q=` + query.q,
        { headers: { Authorization: token } }
      );
      setIndex((prevIndex) => prevIndex + 1);
      setPosts((prev) => [...prev, ...res.data]);
      res.data.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setHasMore(true);
    setIndex(1);
    setPosts([]);
    const fetchData = async () => {
      try {
        if (query.f === "people") {
          const res = await axios.get(
            API_URL + "/api/search/people?offset=0&limit=10&q=" + query.q,
            { headers: { Authorization: token } }
          );
          setPosts(res.data);
          console.log(res.data);
          res.data.length < 10 ? setHasMore(false) : setHasMore(true);
        } else if (query.f === "media") {
          const res = await axios.get(
            API_URL + "/api/search/media?offset=0&limit=9&q=" + query.q,
            { headers: { Authorization: token } }
          );
          setPosts(res.data);
          console.log(res.data);
          res.data.length < 9 ? setHasMore(false) : setHasMore(true);
        } else {
          const res = await axios.get(
            API_URL + "/api/search/post?offset=0&limit=10&q=" + query.q,
            { headers: { Authorization: token } }
          );
          setPosts(res.data);
          console.log(res.data);
          res.data.length < 10 ? setHasMore(false) : setHasMore(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [query.f, query.q, token]);

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
          <nav
            className={`${
              scrollDir === "down" ? "hidden" : ""
            } explore-nav clr-neutral-600`}
          >
            <SiteHeader
              type="search"
              setIsMenuHidden={setIsMenuHidden}
              query={query}
            />
            <div className="explore-nav-container">
              <Link
                className="pointer active clr-neutral-800"
                to={`/explore?q=${query.q}`}
              >
                <div>
                  <p>Post</p>
                </div>
              </Link>
              <Link className="pointer " to={`/explore?q=${query.q}&f=people`}>
                <div>
                  <p>People</p>
                </div>
              </Link>
              <Link className="pointer " to={`/explore?q=${query.q}&f=media`}>
                <div>
                  <p>Media</p>
                </div>
              </Link>
            </div>
          </nav>
          {query.f === "people" ? (
            <div className="profile-posts">
              <InfiniteScroll
                // scrollableTarget={"home-scrollable"}
                dataLength={posts.length}
                next={fetchMoreDataPeople}
                hasMore={hasMore}
                loader={<Loader />}
                scrollThreshold={0.5}
              >
                {posts.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </InfiniteScroll>
            </div>
          ) : query.f === "media" ? (
            <div className="profile-posts">
              <InfiniteScroll
                // scrollableTarget={"home-scrollable"}
                dataLength={posts.length}
                next={fetchMoreDataMedia}
                hasMore={hasMore}
                loader={<Loader />}
                scrollThreshold={0.5}
              >
                {posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="profile-posts">
              <InfiniteScroll
                // scrollableTarget={"home-scrollable"}
                dataLength={posts.length}
                next={fetchMoreDataPosts}
                hasMore={hasMore}
                loader={<Loader />}
                scrollThreshold={0.5}
              >
                {posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))}
              </InfiniteScroll>
            </div>
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
    </>
  );
};

export default Explore;
