import { ArrowBack, Link as LinkIcon } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
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
import { useParams } from "react-router-dom";

const Profile = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(true);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);

  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });

  const { user: currentUser, token } = useContext(AuthContext);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          API_URL + `/api/users?username=${username}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUser(res.data);
        setFollowers(res.data.followers);
        setFollowings(res.data.followings);
        // check is follwed user
        if (res.data.followers.includes(currentUser._id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token, username, currentUser]);

  return (
    <>
      <main className="profile grid-container">
        {!isPhoneScreen && <LeftBar user={currentUser} />}
        <section className="profile-content border-inline padding-block-end-10">
          <header className="profile-header">
            <ArrowBack />
            <div className="profile-header-content padding-block-1">
              <p className="fs-400 fw-bold">{user?.name}</p>
              <span className="fs-200 clr-neutral-600">0 posts</span>
            </div>
          </header>
          <div className="profile-info">
            <div className="profile-cover">
              <div className="profile-cover-img">
                <div className="no-profile-cover"></div>
              </div>
              <div className="profile-avatar">
                <img
                  src={
                    user?.avater ? user.avatear : `${PF}/images/no-avatar.svg`
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="profile-info-content">
              <div className="profile-edit-button">
                {currentUser.username === user?.username ? (
                  <button className="fs-400 fw-bold">Edit profile</button>
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
                  <p>{user?.createdAt}</p>
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
            <div className="active">
              <span className={`fs-400 fw-medium clr-neutral-600 active`}>
                Posts
              </span>
            </div>
            <div>
              <span className={`fs-400 fw-medium clr-neutral-600`}>
                Replies
              </span>
            </div>
            <div>
              <span className={`fs-400 fw-medium clr-neutral-600`}>Media</span>
            </div>
            <div>
              <span className={`fs-400 fw-medium clr-neutral-600`}>Likes</span>
            </div>
          </nav>
          <div className="profile-posts">
            <div className="post-reply"></div>

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
        </section>
        {isDesktopScreen && <RightBar />}
      </main>
    </>
  );
};

export default Profile;
