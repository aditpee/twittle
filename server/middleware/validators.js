const { body } = require("express-validator");

const registerValidator = [
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password must be at least 8 chararters long").isLength({
    min: 8,
  }),
  body(
    "username",
    "Your username can only contain letters, numbers and '_'"
  ).matches(/^[a-zA-Z0-9_]+$/),
  body("username", "Username must be at least 4 chararters long").isLength({
    min: 4,
  }),
];

module.exports = { registerValidator };
