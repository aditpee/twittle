const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

const verifyJwt = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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

// get post what user followed
router.get("/follow", verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const post = await Post.aggregate([
      { $match: { userId: { $in: [...user.followings, req.userId] } } },
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

// get all post by user id
router.get("/", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const post = await Post.aggregate([
      { $match: { retweets: { $elemMatch: { userId: req.query.userId } } } },
      {
        $addFields: {
          isRetweet: true,
          oldCreatedAt: "$createdAt",
        },
      },
      {
        $set: {
          createdAt: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$retweets",
                  as: "retweet",
                  in: {
                    $cond: {
                      if: { $eq: ["$$retweet.userId", req.query.userId] },
                      then: "$$retweet.tweetedAt",
                      else: "$createdAt",
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      { $addFields: { createdAt: { $toDate: "$createdAt" } } },
      {
        $unionWith: {
          coll: "posts",
          pipeline: [
            {
              $match: { userId },
            },
            { $sort: { createdAt: -1 } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: Number(req.query.offset * req.query.limit) },
      { $limit: Number(req.query.limit) },
    ]);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(new Date("2024-07-04T00:35:56.565Z"));
    const myDate = new Date("2024-07-04T00:35:56.565Z");
    const timestamp = Math.floor(myDate / 1000);
    console.log(new ObjectId(Math.floor("2024-07-04T00:35:56.565Z" / 1000)));

    res.status(200).json(post);
    // res
    //   .status(200)
    //   .json(post.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get post by id include media
router.get("/media", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const post = await Post.aggregate([
      { $match: { userId, image: { $ne: "" } } },
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

// get post by id is liked
router.get("/like", async (req, res) => {
  try {
    // const userId = new mongoose.Types.ObjectId(req.query.userId);
    const post = await Post.aggregate([
      { $match: { likes: { $in: [req.query.userId] } } },
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
