import "./user-card.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { API_URL, PF } from "../../config";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const UserCard = ({ user }) => {
  const { token, user: currentUser, dispatch } = useContext(AuthContext);

  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const handleFollow = async (user) => {
    setIsLoadingFollow(true);
    try {
      await axios.put(
        API_URL + `/api/users/${user?.username}/follow`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      currentUser.followings.includes(user?._id)
        ? dispatch({
            type: "UNFOLLOW",
            oldFollower: user?._id,
          })
        : dispatch({
            type: "FOLLOW",
            newFollower: user?._id,
          });
      setIsLoadingFollow(false);
    } catch (err) {
      setIsLoadingFollow(false);
      console.log(err);
    }
  };

  return (
    <div key={user._id} className="usercard">
      <div className="">
        <Link to={`/${user?.username}`}>
          <div className="usercard-avatar margin-inline-end-3">
            <img
              className="radius-circle"
              src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
              alt=""
            />
          </div>
        </Link>
      </div>
      <div>
        <div className="usercard-header">
          <div>
            <Link to={`/${user?.username}`}>
              <p className="fs-400 fw-bold">{user?.name}</p>
            </Link>
            <Link to={`/${user?.username}`}>
              <p className="fs-300 clr-neutral-600">{`@${user?.username}`}</p>
            </Link>
          </div>
          {currentUser?.followings.includes(user?._id) ? (
            <button
              disabled={isLoadingFollow}
              onClick={() => handleFollow(user)}
              className="fs-300 fw-bold bg-neutral-000 clr-neutral-800 padding-inline-4 padding-block-2 radius-2 border-bg-default"
            >
              Following
            </button>
          ) : (
            <button
              disabled={isLoadingFollow}
              onClick={() => handleFollow(user)}
              className="fs-300 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2"
            >
              Follow
            </button>
          )}
        </div>
        {user.bio && (
          <div className="usercard-bio fs-300">
            <p>{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object,
};

export default UserCard;
