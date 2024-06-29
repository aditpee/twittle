import { Create } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import useDetectScroll from "@smakss/react-scroll-direction";

import MobileMenu from "../../components/mobile-menu/MobileMenu";
import MobileNav from "../../components/mobile-nav/MobileNav";
import Post from "../../components/post/Post";
import SiteHeader from "../../components/site-header/SiteHeader";
import "./explore.scss";
import LeftBar from "../../components/left-bar/LeftBar";
import RightBar from "../../components/right-bar/RightBar";
import PostForm from "../../components/post-form/PostForm";

const Explore = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { scrollDir } = useDetectScroll({ thr: 100 });

  return (
    <>
      <main className="explore grid-container">
        {!isPhoneScreen && <LeftBar />}
        <section className="explore-content border-inline padding-block-end-10">
          <MobileMenu
            isMenuHidden={isMenuHidden}
            setIsMenuHidden={setIsMenuHidden}
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
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </section>
        {isDesktopScreen && <RightBar />}
      </main>
    </>
  );
};

export default Explore;
