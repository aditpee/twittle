const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const verifyJwt = require("../middleware/authMiddleware");

router.get("/", verifyJwt, async (req, res) => {
  try {
    // const user = await User.find({
    //   username: { $regex: `${req.query.people}`, $options: "i" },
    // });
    const user = await User.aggregate([
      {
        $match: {
          verifiedEmail: true,
          $or: [
            { name: { $regex: `${req.query.people}`, $options: "mi" } },
            { username: { $regex: `${req.query.people}`, $options: "i" } },
          ],
        },
      },
      { $limit: 10 },
    ]);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// search post by query
router.get("/post/", verifyJwt, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: { text: { $regex: `${req.query.q}`, $options: "mi" } },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/media/", verifyJwt, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          text: { $regex: `${req.query.q}`, $options: "mi" },
          image: { $ne: "" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// search people by query
router.get("/people/", verifyJwt, async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          verifiedEmail: true,
          $or: [
            { name: { $regex: `${req.query.q}`, $options: "mi" } },
            { username: { $regex: `${req.query.q}`, $options: "i" } },
          ],
        },
      },
      { $sort: { verifiedAccount: -1 } },
    ]);

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
