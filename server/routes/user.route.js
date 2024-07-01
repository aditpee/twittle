const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");

const verifyJwt = require("../middleware/authMiddleware");

// router.get("/", verifyJwt, async (req, res) => {
//   res.json(req.username);
// });

// get all user
router.get("/all", verifyJwt, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// get one user by username or id
router.get("/", verifyJwt, async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    }
    if (req.query.username) {
      user = await User.findOne({ username: req.query.username });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const { password, updatedAt, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// // get one user by username
// router.get("/:userId", verifyJwt, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found!" });
//     }

//     const isYourId = user._id.toString() === req.userId;
//     const { password, bookmarks, updatedAt, createdAt, ...others } = user._doc;
//     if (!isYourId) {
//       return res.status(200).json(others);
//     }
//     res.status(200).json({ ...othres, bookmarks, createdAt });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// edit user by username
router.put("/:username", verifyJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isYourId = String(user._id) === req.userId;
    if (!isYourId)
      return res.status(403).json({ error: "Cannot edit with different id" });
    const { name, username, bio, location, website } = req.body;
    const editedUser = { name, username, bio, location, website };
    await User.findByIdAndUpdate(user._id, editedUser);
    res.status(200).json({ message: "Edited user successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete user by username
router.delete("/:username", verifyJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isYourId = String(user._id) === req.userId;
    if (!isYourId)
      return res.status(403).json({ error: "Cannot delete with different id" });

    await User.findByIdAndDelete(user._id);
    res.status(200).json({ message: "Deleted user successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// follow user
router.put("/:username/follow", verifyJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const currentUser = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isYourUsername = currentUser.username === req.params.username;
    if (isYourUsername)
      return res.status(403).json({ error: "Cannot follow yourself" });

    const followUser = async () => {
      await user.updateOne({ $push: { followers: currentUser._id } });
      await currentUser.updateOne({ $push: { followings: currentUser._id } });
      return res.status(200).json({ message: "Follow user" });
    };
    const unfollowUser = async () => {
      await user.updateOne({ $pull: { followers: currentUser._id } });
      await currentUser.updateOne({ $pull: { followings: currentUser._id } });
      return res.status(200).json({ message: "Unfollow user" });
    };
    if (user.followers.includes(currentUser._id)) {
      await unfollowUser();
    } else {
      await followUser();
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// verifyEmail user
router.put("/:userId/verify/:token", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(404)
        .json({ error: "This token is not for your account" });

    const token = await Token.findOne({
      _id: req.params.token,
      userId: req.params.userId,
    });
    if (!token)
      return res.status(404).json({ error: "Token expired or not valid" });

    await user.updateOne({ verifiedEmail: true });
    await token.deleteOne();
    res.status(200).json({ message: "Your email now verified" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error, cannot verified your account" });
  }
});

// unfollow user

module.exports = router;
