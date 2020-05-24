const User = require("../models/user");
const validator = require("express-validator");
const async = require("async");
const Post = require("../models/post");

// POST request to create post
exports.postCreate = [
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // create a post object with escaped data
    const post = new Post({
      content: req.body.content,
      user: req.user,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  },
];

// PUT request to edit post
exports.postEdit = [
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    Post.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      (err, doc) => {
        if (err) {
          return next(err);
        }
        if (!doc) {
          return res.sendStatus(404);
        }
        return res.sendStatus(200);
      }
    );
  },
];

// DELETE request to delete post
exports.postDelete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  });
};

// POST request to like post
exports.postLike = (req, res, next) => {
  // https://medium.com/@salonimalhotra1ind/how-to-increment-a-number-value-in-mongoose-785066ba09d8
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { likes: 1 },
    },
    (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(404);
      }
      return res.redirect(req.get("referer"));
    }
  );
};
