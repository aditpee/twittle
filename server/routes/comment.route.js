const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const verifyJwt = require("../middleware/authMiddleware");

// add comment
router.post("/", verifyJwt, async (req, res) => {
  try {
    const { postId, text, image } = req.body;
    const newComment = new Comment({
      postId: postId,
      userId: req.userId,
      text: text || "",
      image: image || "",
    });

    const comment = await newComment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json("Internal server error!");
  }
});

// get comment in post id
router.get("/", verifyJwt, async (req, res) => {
  try {
    let comments = null;
    if (req.query.postId)
      comments = await Comment.find({ postId: req.query.postId });
    if (req.query.commentId)
      comments = await Comment.findById(req.query.commentId);

    if (!comments === null) {
      return res.json(404).json("cannot find comment");
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

// delete comment
router.delete("/:commentId", verifyJwt, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    const isYourComment = comment.userId === req.userId;
    if (!isYourComment)
      return res.status(403).json("Only can delete your reply post");

    res.status(200).json("Your post was deleted");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

//
//
//
//
//
//
//
//
//
//
//

// like post
router.put("/:postId/like", verifyJwt, async (req, res) => {
  try {
    const post = await Comment.findById(req.params.postId);
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
    const post = await Comment.findById(req.params.postId);
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
    const post = await Comment.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.retweets.some((obj) => obj.userId === req.userId)) {
      // unretweet
      await post.updateOne({
        $pull: { retweets: { userId: req.userId } },
      });
      res.status(200).json({ message: "post has been unretweeted" });
    } else {
      // retweet
      await post.updateOne({
        $push: {
          retweets: { userId: req.userId, tweetedAt: new Date().toISOString() },
        },
      });
      res.status(200).json({ message: "post has been retweeted" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
