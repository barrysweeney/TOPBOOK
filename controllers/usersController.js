const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Post = require("../models/post");

// GET request for all users
exports.allUsers = (req, res, next) => {
  User.find({}).exec((err, userList) => {
    if (err) {
      return next(err);
    }
    res.json(userList);
  });
};

// GET request for user
exports.userGet = (req, res, next) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      return next(err);
    }
    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    return res.json(user);
  });
};

// GET request for profile of user - user details and their posts
exports.userProfile = (req, res, next) => {
  async.parallel(
    {
      user: (callback) => User.findById(req.params.id).exec(callback),
      userPosts: (callback) =>
        Post.find({ user: req.params.id }).exec(callback),
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user === null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      res.json({ user: results.user, posts: results.userPosts });
    }
  );
};

// POST request to create user
exports.userCreate = [
  validator.body("name").trim(),
  // validate paswordConfirmation field using custom validator
  validator
    .check(
      "confirmPassword",
      "Password confirmation field must have the same value as the password field"
    )
    .custom((value, { req }) => value === req.body.password),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from request
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    }
    // create and save a user object with escaped data and hashed password and redirect to home page
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        name: req.body.name,
        password: hashedPassword,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];

// DELETE request to delete user
exports.userDelete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  });
};

// PUT request to update user
exports.userUpdate = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { name: req.body.name }, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(404);
    }
    return res.sendStatus(200);
  });
};

// GET request for all posts by a specific user
exports.userPosts = (req, res, next) => {
  Post.find({ user: req.params.id }).exec((err, posts) => {
    if (err) {
      return next(err);
    }
    return res.json(posts);
  });
};
