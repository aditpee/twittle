import { AddAPhotoOutlined, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { validate } from "react-email-validator";
import PostForm from "../post-form/PostForm";
import Post from "../post/Post";
import { API_URL, PF } from "../../config";
import "./edit-profile.scss";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const EditProfile = ({ showModal, setShowModal, user }) => {
  const [validateUsername, setValidateUsername] = useState("");
  const [validateName, setValidateName] = useState("");
  const [validateBio, setValidateBio] = useState("");
  const [validateLocation, setValidateLocation] = useState("");
  const [validateWebsite, setValidateWebsite] = useState("");

  const [inputEdit, setInputEdit] = useState({});

  const usernameRef = useRef();
  const nameRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();
  const websiteRef = useRef();

  const [totalCharName, setTotalCharName] = useState(null);

  const { token, dispatch } = useContext(AuthContext);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: nameRef.current.value,
        username: usernameRef.current.value,
        bio: bioRef.current.value,
        location: locationRef.current.value,
        website: websiteRef.current.value,
      };

      const res = await axios.put(
        API_URL + "/api/users/" + user.username,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(res);
      setShowModal(false);
      dispatch({
        type: "EDIT_PROFILE",
        payload: data,
      });
    } catch (err) {
      console.log(err);
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
      <main className="edit-profile">
        <form onSubmit={handleSubmit} className="edit-profile-modal">
          <div className="edit-profile-header">
            <div
              onClick={() => setShowModal(false)}
              className="edit-profile-close"
            >
              <ArrowBack />
            </div>
            <div>
              <button className="fs-300 fw-bold padding-block-2 padding-inline-4 radius-2 clr-neutral-000 bg-neutral-800 margin-inline-start-3">
                Save
              </button>
            </div>
          </div>
          <div className="edit-profile-modal-wrapper flow">
            <div className="edit-profile-form">
              <div className="edit-profile-cover">
                <div className="edit-profile-cover-img">
                  <div className="no-edit-profile-cover"></div>
                  <div className="addImgIcon">
                    <AddAPhotoOutlined />
                  </div>
                </div>
                <div className="edit-profile-avatar">
                  <img src={PF + "/images/no-avatar.svg"} alt="" />
                  <div className="addImgIcon">
                    <AddAPhotoOutlined />
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
