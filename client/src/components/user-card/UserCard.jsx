import "./user-card.scss";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, PF } from "../../config";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const UserCard = ({ user }) => {
  const { token, user: currentUser, dispatch } = useContext(AuthContext);

  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const handleFollow = async (e, user) => {
    e.preventDefault();
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
      <Link to={`/${user?.username}`}>
        <div className="">
          <div className="usercard-avatar margin-inline-end-3">
            <img
              className="radius-circle"
              src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
              alt=""
            />
          </div>
        </div>
        <div>
          <div className="usercard-header">
            <div>
              <p className="fs-400 clr-neutral-800 fw-bold">{user?.name}</p>
              <p className="fs-300 clr-neutral-600">{`@${user?.username}`}</p>
            </div>
            {currentUser?.followings.includes(user?._id) ? (
              <button
                disabled={isLoadingFollow}
                onClick={(e) => handleFollow(e, user)}
                className="fs-200 fw-bold bg-neutral-000 clr-neutral-800 padding-inline-4 padding-block-2 radius-2 border-bg-default"
              >
                Following
              </button>
            ) : (
              <button
                disabled={isLoadingFollow}
                onClick={(e) => handleFollow(e, user)}
                className="fs-200 fw-bold bg-neutral-800 clr-neutral-000 padding-inline-4 padding-block-2 radius-2"
              >
                Follow
              </button>
            )}
          </div>
          {user.bio && (
            <div className="usercard-bio clr-neutral-800 fs-300">
              <p>{user.bio}</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object,
};

export default UserCard;
