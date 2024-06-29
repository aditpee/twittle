const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  token: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, expires: "1h", default: Date.now }, // 1 hour
});

module.exports = mongoose.model("token", TokenSchema);
