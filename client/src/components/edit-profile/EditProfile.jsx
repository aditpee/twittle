import { AddAPhotoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { validate } from "react-email-validator";
import PostForm from "../post-form/PostForm";
import Post from "../post/Post";
import {
  API_URL,
  CLOUDINARY_API,
  CLOUDINARY_UPLOAD_PRESET,
  PF,
} from "../../config";
import "./edit-profile.scss";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { ArrowBack, Cancel } from "../../utils/icons/icons";
import AlertDialog from "../alert-dialog/AlertDialog";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const EditProfile = ({ showModal, setShowModal, user }) => {
  const [validateUsername, setValidateUsername] = useState("");
  const [validateName, setValidateName] = useState("");
  const [validateBio, setValidateBio] = useState("");
  const [validateLocation, setValidateLocation] = useState("");
  const [validateWebsite, setValidateWebsite] = useState("");
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [inputEdit, setInputEdit] = useState({});
  const modalRef = useRef();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const nameRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();
  const websiteRef = useRef();

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [coverUrl, setCoverUrl] = useState(user.cover);

  const [openDialog, setOpenDialog] = useState(false);
  const dialogParams = {
    title: "Discard changes?",
    content: "This can’t be undone and you’ll lose your changes.",
    colorButton: "bg-accent-red",
    textButton: "Discard",
  };

  const [totalCharName, setTotalCharName] = useState(null);

  const { token, dispatch } = useContext(AuthContext);

  const debounced = useDebouncedCallback((e, fnCallback) => {
    fnCallback(e);
  }, 1000);

  const restoreInput = () => {
    setInputEdit({
      name: user.name,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
    });
    setCoverUrl(user.cover);
    setAvatarUrl(user.avatar);
    if (!user.avatar) {
      setAvatarFile(null);
    }
    if (!user.cover) {
      setCoverFile(null);
    }
  };

  const validateNoSpaceValue = (stringVal) => {
    return /\s/g.test(stringVal);
  };

  const setCustomErrorMessage = (inputElement, message, fnState) => {
    fnState(message);
    inputElement.classList.add("invalid");
  };
  const removeCustomErrorMessage = (inputElement, fnState) => {
    fnState(null);
    inputElement.classList.remove("invalid");
  };

  const handleInputUsername = (e) => {
    removeCustomErrorMessage(e.target, setValidateUsername);
    setTotalCharName(e.target.value.length);

    const regexUsername = new RegExp("^[a-zA-Z0-9_]+$");

    const invalidUsername = !regexUsername.test(e.target.value);
    const invalidUsernameMessage =
      "Your username can only contain letters, numbers and '_'";
    const isHaveSpace = validateNoSpaceValue(e.target.value);
    const haveSpaceMessage = "Cannot have space";
    const isDontHaveVal = e.target.value === "";
    const dontHaveValMessage = "This input must have value";

    if (invalidUsername)
      setCustomErrorMessage(
        e.target,
        invalidUsernameMessage,
        setValidateUsername
      );
    if (isHaveSpace)
      setCustomErrorMessage(e.target, haveSpaceMessage, setValidateUsername);
    if (isDontHaveVal)
      setCustomErrorMessage(e.target, dontHaveValMessage, setValidateUsername);
  };

  const handleInputName = (e) => {
    removeCustomErrorMessage(e.target, setValidateName);
    setTotalCharName(e.target.value.length);

    const isDontHaveVal = e.target.value === "";
    const dontHaveValMessage = "Name can't be blank";

    if (isDontHaveVal)
      setCustomErrorMessage(e.target, dontHaveValMessage, setValidateName);
  };

  const handleInputBio = (e) => {
    removeCustomErrorMessage(e.target, setValidateBio);
    setTotalCharName(e.target.value.length);
  };

  const handleInputLocation = (e) => {
    removeCustomErrorMessage(e.target, setValidateLocation);
    setTotalCharName(e.target.value.length);
  };

  const handleInputWebsite = (e) => {
    removeCustomErrorMessage(e.target, setValidateWebsite);
    setTotalCharName(e.target.value.length);
  };

  const handleAvatarInput = (e) => {
    setAvatarFile(e.target.files[0]);
    e.target.value = "";
    setAvatarUrl(null);
  };
  const handleCoverInput = (e) => {
    setCoverFile(e.target.files[0]);
    e.target.value = "";
    setCoverUrl(null);
  };

  const handleClose = () => {
    const oldInput = {
      name: user.name.trim(),
      username: user.username.trim(),
      bio: user.bio.trim(),
      location: user.location.trim(),
      website: user.website.trim(),
      avatar: user.avatar.trim(),
      cover: user.cover.trim(),
    };
    const newInput = {
      name: nameRef.current.value.trim(),
      username: usernameRef.current.value.trim(),
      bio: bioRef.current.value.trim(),
      location: locationRef.current.value.trim(),
      website: websiteRef.current.value.trim(),
      avatar: avatarUrl,
      cover: coverUrl,
    };

    const isInputChange = JSON.stringify(oldInput) !== JSON.stringify(newInput);

    if (!isInputChange) {
      restoreInput();
      setShowModal(false);
      return;
    }

    setOpenDialog(true);

    // console.log(oldInput, newInput);
  };

  const checkExistingUserByUsername = async (e) => {
    if (e.target.value.length < 4) {
      return;
    }
    try {
      if (e.target.value !== user.username) {
        await axios.get(
          API_URL + "/api/auth/checkExistUser?username=" + e.target.value
        );
      }
    } catch (err) {
      setCustomErrorMessage(
        usernameRef.current,
        err.response.data,
        setValidateUsername
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingEdit(true);

    try {
      const data = {
        name: nameRef.current.value.trim(),
        username: usernameRef.current.value.trim(),
        bio: bioRef.current.value.trim(),
        location: locationRef.current.value.trim(),
        website: websiteRef.current.value.trim(),
        avatar: user.avatar,
        cover: coverUrl,
      };

      if (avatarFile) {
        const formDataAvatar = new FormData();
        formDataAvatar.append("file", avatarFile);
        formDataAvatar.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(CLOUDINARY_API.upload, formDataAvatar);

        data.avatar = res.data["secure_url"];
      }
      if (coverFile) {
        const formDataAvatar = new FormData();
        formDataAvatar.append("file", coverFile);
        formDataAvatar.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(CLOUDINARY_API.upload, formDataAvatar);

        data.cover = res.data["secure_url"];
      }

      const res = await axios.put(
        API_URL + "/api/users/" + user.username,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setIsLoadingEdit(false);
      setShowModal(false);
      setAvatarFile(null);
      dispatch({
        type: "EDIT_PROFILE",
        payload: data,
      });
      if (user.username !== data.username) {
        navigate(`/${data.username}`, { replace: true });
      }
    } catch (err) {
      setIsLoadingEdit(false);
      const { errors } = err.response.data;
      if (errors) {
        const error = errors[0];
        console.log(error);
        toast.success(error.msg, {
          position: "bottom-center",
          theme: "colored",
          closeOnClick: false,
          pauseOnHover: false,
          hideProgressBar: true,
          autoClose: 5000,
          icon: false,
          closeButton: false,
        });
      } else {
        toast.success("Internal server error", {
          position: "bottom-center",
          theme: "colored",
          closeOnClick: false,
          pauseOnHover: false,
          hideProgressBar: true,
          autoClose: 5000,
          icon: false,
          closeButton: false,
        });
      }
    }
  };

  useEffect(() => {
    setInputEdit({
      name: user.name,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
    });
  }, [user.name, user.username, user.bio, user.location, user.website]);

  return (
    showModal && (
      <main
        ref={modalRef}
        onClick={(e) => {
          if (e.target === modalRef.current) setShowModal(false);
        }}
        className="edit-profile"
      >
        <AlertDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          dialogAction={() => {
            setShowModal(false);
            restoreInput();
          }}
          dialogParams={dialogParams}
        />
        <form
          onSubmit={handleSubmit}
          className="edit-profile-modal bg-neutral-000"
        >
          <div className="edit-profile-header">
            <div
              onClick={handleClose}
              className="edit-profile-close clr-neutral-800"
            >
              <ArrowBack />
            </div>
            <div>
              <button
                disabled={isLoadingEdit}
                className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-start-3"
              >
                Save
              </button>
            </div>
          </div>
          <div className="edit-profile-modal-wrapper flow">
            <div className="edit-profile-form">
              <div className="edit-profile-cover">
                <div className="edit-profile-cover-img">
                  {coverFile ? (
                    <img src={URL.createObjectURL(coverFile)} alt="" />
                  ) : user.cover && !coverFile && coverUrl ? (
                    <img src={user.cover} alt="mana" />
                  ) : (
                    <div className="no-edit-profile-cover"></div>
                  )}
                  <input
                    type="file"
                    hidden
                    id="cover-file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleCoverInput}
                  />
                  <div className="coverImgIcon">
                    <label htmlFor="cover-file">
                      <AddAPhotoOutlined />
                    </label>
                    {(coverFile || coverUrl) && (
                      <div
                        onClick={() => {
                          setCoverFile(null);
                          setCoverUrl(null);
                        }}
                      >
                        <Cancel />
                      </div>
                    )}
                  </div>
                </div>
                <div className="edit-profile-avatar bg-neutral-400">
                  <img
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : user.avatar && !avatarFile
                        ? user.avatar
                        : PF + "/images/no-avatar.svg"
                      // post
                      // avatarFile
                      //   ? URL.createObjectURL(avatarFile)
                      //   : PF + "/images/no-avatar.svg"
                    }
                    alt=""
                  />
                  <input
                    type="file"
                    hidden
                    id="avatar-file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleAvatarInput}
                  />
                  <div className="coverImgIcon">
                    <label htmlFor="avatar-file" className="addImgIcon pointer">
                      <AddAPhotoOutlined />
                    </label>
                  </div>
                </div>
              </div>
              <div className="edit-profile-inputs twittle-inputs">
                <div>
                  <div>
                    <input
                      ref={nameRef}
                      value={inputEdit.name || ""}
                      onChange={(e) => {
                        setInputEdit((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                      id="name"
                      className="clr-neutral-800"
                      placeholder=" "
                      type="text"
                      required
                      onInput={handleInputName}
                      maxLength="30"
                    />
                    <label
                      htmlFor="name"
                      className="label register-label clr-neutral-600"
                    >
                      Name
                    </label>
                    <p className="twittle-inputs-char-limit">
                      {totalCharName || 0} / 30
                    </p>
                  </div>
                  {validateName && (
                    <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                      {validateName}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                    <input
                      ref={usernameRef}
                      value={inputEdit.username || ""}
                      onChange={(e) => {
                        setInputEdit((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }));
                        debounced(e, checkExistingUserByUsername);
                      }}
                      id="username"
                      className="clr-neutral-800"
                      placeholder=" "
                      type="text"
                      required
                      onInput={handleInputUsername}
                      maxLength="15"
                    />
                    <label
                      htmlFor="username"
                      className="label register-label clr-neutral-600"
                    >
                      Username
                    </label>
                    <p className="twittle-inputs-char-limit">
                      {totalCharName || 0} / 15
                    </p>
                  </div>
                  {validateUsername && (
                    <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                      {validateUsername}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                    <textarea
                      ref={bioRef}
                      value={inputEdit.bio || ""}
                      onChange={(e) => {
                        setInputEdit((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }));
                      }}
                      id="bio"
                      className="clr-neutral-800"
                      placeholder=" "
                      type="text"
                      onInput={handleInputBio}
                      maxLength="160"
                    ></textarea>
                    <label
                      htmlFor="bio"
                      className="register-label clr-neutral-600"
                    >
                      Bio
                    </label>
                    <p className="twittle-inputs-char-limit">
                      {totalCharName || 0} / 160
                    </p>
                  </div>
                  {validateBio && (
                    <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                      {validateBio}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                    <input
                      ref={locationRef}
                      value={inputEdit.location || ""}
                      onChange={(e) => {
                        setInputEdit((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }));
                      }}
                      id="location"
                      className="clr-neutral-800"
                      placeholder=" "
                      type="text"
                      onInput={handleInputLocation}
                      maxLength="30"
                    />
                    <label
                      htmlFor="location"
                      className="register-label clr-neutral-600"
                    >
                      Location
                    </label>
                    <p className="twittle-inputs-char-limit">
                      {totalCharName || 0} / 30
                    </p>
                  </div>
                  {validateLocation && (
                    <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                      {validateLocation}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                    <input
                      ref={websiteRef}
                      value={inputEdit.website || ""}
                      onChange={(e) => {
                        setInputEdit((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }));
                      }}
                      id="website"
                      className="clr-neutral-800"
                      placeholder=" "
                      type="text"
                      onInput={handleInputWebsite}
                      maxLength="100"
                    />
                    <label
                      htmlFor="website"
                      className="register-label clr-neutral-600"
                    >
                      Website
                    </label>
                    <p className="twittle-inputs-char-limit">
                      {totalCharName || 0} / 100
                    </p>
                  </div>
                  {validateWebsite && (
                    <p className="twittle-input-invalid text-left margin-inline-start-2 clr-accent-red fs-100">
                      {validateWebsite}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    )
  );
};

EditProfile.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  user: PropTypes.object,
};

export default EditProfile;
