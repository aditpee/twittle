const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJwt = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    req.username = decode.username;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = verifyJwt;
