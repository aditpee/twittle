import { ArrowBack, MoreHoriz } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import useDetectScroll from "@smakss/react-scroll-direction";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LeftBar from "../../components/left-bar/LeftBar";
import MobileNav from "../../components/mobile-nav/MobileNav";
import MobilePost from "../../components/mobile-post/MobilePost";
import PostModal from "../../components/post-modal/PostModal";
import PostMenu from "../../components/PostMenu/PostMenu";
import RightBar from "../../components/right-bar/RightBar";
import { PF } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import "./post-details.scss";

const PostDetails = () => {
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const isDesktopScreen = useMediaQuery("(min-width: 65rem)");

  const [showModalPost, setShowModalPost] = useState(false);

  const { scrollDir } = useDetectScroll({ thr: 100 });

  const { user: currentUser, token } = useContext(AuthContext);

  return (
    <main className="profile grid-container">
      {/* <PostModal
    showModal={showModalPost}
    setShowModal={setShowModalPost}
    setPosts={setPosts}
  /> */}
      {!isPhoneScreen && (
        <LeftBar user={currentUser} setShowModal={setShowModalPost} />
      )}
      <section className="profile-content border-inline padding-block-end-10">
        <header
          className={`${
            scrollDir === "down" ? "hidden" : ""
          } profile-header padding-block-2`}
        >
          <Link to={-1} className="d-flex">
            <ArrowBack />
          </Link>
          <div className="profile-header-content padding-block-1">
            <p className="fs-400 fw-bold">Post</p>
          </div>
        </header>
        <div className="postdetails-body padding-inline-4">
          <div className="post-container postdetails-body-header">
            <div className="post-avatar">
              <img
                className="radius-circle hidden"
                src={PF + "/images/no-avatar.svg"}
                alt=""
              />
            </div>
            <div className="post-content">
              <div>
                <div className="post-desc">
                  <Link to={``}>
                    <h4 className="fs-300 fw-bold clr-neutral-800">
                      {/* {user?.name || ""} */}
                      Nama Twittle
                    </h4>
                  </Link>
                  <div>
                    <Link to={``}>
                      <span className="fs-300 clr-neutral-600">
                        {/* {`@${user?.username}` || ""} */}
                        @username
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="d-flex align-center">
                  <button className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-start-3">
                    Follow
                  </button>
                  <PostMenu
                    button={
                      <div className="post-setting pointer">
                        <MoreHoriz />
                      </div>
                    }
                    // handleDeletePost={handleDeletePost}
                    // setOpenDialog={setOpenDialog}
                    // openDialog={openDialog}
                  ></PostMenu>
                </div>
              </div>
            </div>
          </div>
          <div className="postdetails-body-main margin-block-4">
            <p style={{ fontSize: "17px" }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt
              doloremque aut provident consequatur quam impedit, laborum
              consectetur dignissimos, porro similique libero ducimus animi
              accusamus atque repellat vitae id rerum ab!
            </p>
            <div className="post-img margin-block-start-3">
              <img src={PF + "/images/post-img-2.png"} alt="" />
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
