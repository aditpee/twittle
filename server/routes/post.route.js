const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

const verifyJwt = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// add post
router.post("/", verifyJwt, async (req, res) => {
  try {
    const { text, image } = req.body;
    const newPost = new Post({
      userId: req.userId,
      text: text ? text : "",
      image: image ? image : "",
    });
    // save post
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all post
router.get("/all", async (req, res) => {
  try {
    const post = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: Number(req.query.offset * req.query.limit) },
      { $limit: Number(req.query.limit) },
    ]);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all post by id
router.get("/", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const post = await Post.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: -1 } },
      { $skip: Number(req.query.offset * req.query.limit) },
      { $limit: Number(req.query.limit) },
    ]);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// // edit post
// ======== is premium twitter feature =======

// delete post
router.delete("/:postId", verifyJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isYourPost = String(post.userId) === req.userId;
    if (!isYourPost) {
      return res.status(403).json({ error: "Is not your post" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Your post was deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// like post
router.put("/:postId/like", verifyJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(req.userId)) {
      // unlike
      await post.updateOne({ $pull: { likes: req.userId } });
      return res.status(200).json({ message: "unlike post successfully" });
    } else {
      // like
      await post.updateOne({ $push: { likes: req.userId } });
      return res.status(200).json({ message: "like post successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// bookmark post
router.put("/:postId/bookmark", verifyJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.bookmarks.includes(req.userId)) {
      // unbookmark
      await post.updateOne({ $pull: { bookmarks: req.userId } });
      res.status(200).json({ message: "unbookmark post successfully" });
    } else {
      // bookmark
      await post.updateOne({ $push: { bookmarks: req.userId } });
      res.status(200).json({ message: "bookmark post successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// retweet post
router.put("/:postId/retweet", verifyJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.retweets.includes(req.userId)) {
      // unretweet
      await post.updateOne({ $pull: { retweets: req.userId } });
      res.status(200).json({ message: "post has been unretweeted" });
    } else {
      // retweet
      await post.updateOne({ $push: { retweets: req.userId } });
      res.status(200).json({ message: "post has been retweeted" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
