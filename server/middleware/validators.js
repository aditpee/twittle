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
  body("username", "Username maximal charater is 15").isLength({
    max: 15,
  }),
];

const editProfileValidator = [
  body(
    "username",
    "Your username can only contain letters, numbers and '_'"
  ).matches(/^[a-zA-Z0-9_]+$/),
  body("username", "Username must be at least 4 chararters long").isLength({
    min: 4,
  }),
  body("username", "Username cannot have more than 15 characters").isLength({
    max: 15,
  }),
  body("username", "Username can’t be blank").notEmpty(),
  body("name", "Name can’t be blank").notEmpty(),
  body("name", "Username cannot have more than 50 characters").isLength({
    max: 50,
  }),
  body("bio", "Bio cannot have more than 160 characters").isLength({
    max: 160,
  }),
  body("location", "Location cannot have more than 30 characters").isLength({
    max: 30,
  }),
  body("website", "Website cannot have more than 100 characters").isLength({
    max: 100,
  }),
  body("website", "Please input a valid url").isURL(),
];

module.exports = { registerValidator, editProfileValidator };
