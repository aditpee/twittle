const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/User");
const Token = require("../models/Token");
const verifyJwt = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
const { registerValidator } = require("../middleware/validators");

router.post("/register", [registerValidator], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      name: req.body.username,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // create new token
    const newToken = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await newToken.save();

    const url = `${process.env.BASE_URL}/emailVerify/${user._id}/${newToken._id}`;
    await sendEmail(
      newUser.email,
      "Twittle email verification",
      `VERIF YOUR EMAIL ${url}`
    );

    res.status(200).json({ message: "Registration successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registeration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user;

    username
      ? (user = await User.findOne({ username }))
      : (user = await User.findOne({ email }));

    if (!user) {
      username
        ? res.status(401).json({ username: "Username doesn't exist" })
        : res.status(401).json({ email: "Email doesn't exist" });
      return;
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({ password: "Password is wrong" });
    }

    if (!user.verifiedEmail) {
      const token = await Token.findOne({ userId: user._id });
      if (token) {
        // resend email
        const url = `${process.env.BASE_URL}/emailVerify/${user._id}/${token._id}`;

        await sendEmail(
          user.email,
          "Twittle email verification",
          `VERIF YOUR EMAIL ${url}`
        );
        return res.status(401).json({
          error:
            "Your account not verified. An email has been resent to your email, please check your inbox or spam folder",
        });
      }
      // resend email with new token
      const newToken = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await newToken.save();

      const url = `${process.env.BASE_URL}/emailVerify/${user._id}/${newToken._id}`;

      await sendEmail(
        user.email,
        "Twittle email verification",
        `VERIF YOUR EMAIL ${url}`
      );
      return res.status(401).json({
        error:
          "Your account not verified. An email has been resent to your email, please check your inbox or spam folder",
      });
    }

    const tokenJwt = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET
    );
    const { password: userPassword, updatedAt, ...others } = user._doc;
    res.status(200).json({ token: tokenJwt, user: others });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// verify jwt
router.get("/verifyJwt", verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkExistUser", async (req, res) => {
  try {
    const email = req.query.email;
    const username = req.query.username;

    let user = null;
    if (email) {
      user = await User.findOne({ email });
      if (user)
        return res
          .status(404)
          .json("That email has been taken. Please choose another.");
    }
    if (username) {
      user = await User.findOne({ username });
      if (user)
        return res
          .status(404)
          .json("That username has been taken. Please choose another.");
    }

    res.status(200).json("Email or username is available");
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
