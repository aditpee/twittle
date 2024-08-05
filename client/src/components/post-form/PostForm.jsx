import { Close } from "@mui/icons-material";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import {
  API_URL,
  CLOUDINARY_API,
  CLOUDINARY_UPLOAD_PRESET,
  PF,
} from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Gif, Globe, Picture } from "../../utils/icons/icons";
import PropTypes from "prop-types";
import "./post-form.scss";

const PostForm = ({
  setPosts,
  setShowModal,
  type,
  textButton,
  postId,
  isModal,
}) => {
  const textAreaRef = useRef();
  const [valTextArea, setValTextArea] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isHide, setIsHide] = useState(true);

  const { user, token } = useContext(AuthContext);

  const resetPostForm = () => {
    setImage(null);
    setImageURL(null);
    setIsLoadingPost(false);
    setValTextArea("");
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";

      const scrollHeight = textAreaRef.current.scrollHeight;

      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [valTextArea]);

  const handleChangeTextarea = (e) => {
    setValTextArea(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingPost(true);

    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const resImg = await axios.post(CLOUDINARY_API.upload, formData);
        imageUrl = resImg.data["secure_url"];
      }

      const data = {
        text: valTextArea ? valTextArea : "",
        image: imageUrl ? imageUrl : "",
        postId: postId || "",
      };
      const res = await axios.post(API_URL + `/api/${type || "posts"}`, data, {
        headers: {
          Authorization: token,
        },
      });
      setPosts((prev) => [{ ...res.data, image: data.image }, ...prev]);

      resetPostForm();
      setShowModal && setShowModal(false);
    } catch (err) {
      resetPostForm();
      setShowModal && setShowModal(false);
      console.log(err);
    }
  };

  const handleChangeImage = (e) => {
    const newImage = e.target.files[0];
    e.target.value = "";
    setImage(newImage);
    setImageURL(URL.createObjectURL(newImage));
  };

  const replyPostStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
  };

  return (
    <form
      className={`postform ${isLoadingPost && "loading-post"}`}
      action=""
      onSubmit={handleSubmit}
      onClick={() => textAreaRef.current.focus()}
    >
      <div className="postform-avatar">
        <img
          className="radius-circle"
          src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
          alt=""
        />
      </div>
      <div
        style={isHide && !isModal && type === "comments" ? replyPostStyle : {}}
      >
        <div className="postform-input">
          <textarea
            onFocus={() => setIsHide(false)}
            className="fs-600 clr-neutral-800"
            type="text"
            value={valTextArea}
            placeholder="What is happening?!"
            onChange={handleChangeTextarea}
            ref={textAreaRef}
            maxLength="280"
          ></textarea>
        </div>
        {image && (
          <div className="postform-img">
            <img src={imageURL} alt="img-upload" />
            <div
              onClick={() => {
                setImage(null);
                setImageURL(null);
              }}
              className="postform-img-close"
            >
              <Close className="clr-neutral-000" />
            </div>
          </div>
        )}

        {!isLoadingPost && (
          <>
            {!isHide && type !== "comments" && (
              <div className="postform-canreply clr-primary-000 fw-medium fs-300">
                <Globe />
                <p>Everyone can reply</p>
              </div>
            )}
            <div
              className="postform-submit"
              style={
                isHide && type === "comments"
                  ? { paddingBlock: ".25rem 2rem" }
                  : {}
              }
            >
              {isHide && type === "comments" && !isModal ? (
                ""
              ) : (
                <div className="postform-submit-icons">
                  <input
                    id="twittle-upload-img"
                    onChange={handleChangeImage}
                    type="file"
                    hidden
                    accept=".jpg, .png, .jpeg"
                  />
                  <label
                    htmlFor="twittle-upload-img"
                    className="d-flex align-center clr-primary-000 pointer"
                  >
                    <Picture />
                  </label>
                  <label className="d-flex align-center clr-primary-000 pointer">
                    <Gif />
                  </label>
                </div>
              )}
              <div className="">
                {valTextArea.length > 0 && (
                  <svg
                    className="postform-bar"
                    viewBox="0 0 160 160"
                    style={{
                      transform: "rotate(-90deg)",
                    }}
                  >
                    <circle
                      className="postform-bar-track"
                      r="70"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      strokeWidth="12px"
                    ></circle>
                    <circle
                      className="postform-bar-progress"
                      r="70"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      strokeWidth="12px"
                      strokeDasharray="439.6px"
                      strokeDashoffset={`${
                        439.6 -
                        (439.6 * (100 / (280 / valTextArea.length))) / 100
                      }px`}
                    ></circle>
                  </svg>
                )}
                <button
                  className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-primary-000"
                  disabled={valTextArea || image ? false : true}
                >
                  {textButton || "Post"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

PostForm.propTypes = {
  setPosts: PropTypes.func,
  setShowModal: PropTypes.func,
  type: PropTypes.string,
  textButton: PropTypes.string,
  postId: PropTypes.string,
  isModal: PropTypes.bool,
};

export default PostForm;
