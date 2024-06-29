import { AddAPhotoOutlined, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { validate } from "react-email-validator";
import PostForm from "../../components/post-form/PostForm";
import Post from "../../components/post/Post";
import { PF } from "../../config";
import "./edit-profile.scss";

const EditProfile = () => {
  const [validateUsername, setValidateUsername] = useState("");
  const [validateName, setValidateName] = useState("");
  const [validateBio, setValidateBio] = useState("");
  const [validateLocation, setValidateLocation] = useState("");
  const [validateWebsite, setValidateWebsite] = useState("");

  const [totalCharName, setTotalCharName] = useState(null);

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

  return (
    <main className="edit-profile">
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <div className="edit-profile-close">
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
                <img src={PF + "./images/no-avatar.svg"} alt="" />
                <div className="addImgIcon">
                  <AddAPhotoOutlined />
                </div>
              </div>
            </div>
            <div className="edit-profile-inputs twittle-inputs">
              <div>
                <div>
                  <input
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
      </div>
    </main>
  );
};

export default EditProfile;
