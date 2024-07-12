const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const verifyJwt = require("../middleware/authMiddleware");

router.get("/", verifyJwt, async (req, res) => {
  try {
    console.log(req.query.people);
    const user = await User.find({
      username: { $regex: `${req.query.people}`, $options: "i" },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
