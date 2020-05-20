const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Frienship = require("../models/friendship");
const Posts = require("../models/post");

// POST request to log-in
exports.postLogIn = (req, res, next) => {
  res.send("not implemented yet");
};

// POST request to log-out
exports.logOut = (req, res, next) => {
  res.send("not implemented yet");
};

// GET request for home page (timeline)
exports.getHomePage = (req, res, next) => {
  res.send("not implemented yet");
  // get all posts by the logged in user or by their friends
};
