const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followings: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    avatar: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
