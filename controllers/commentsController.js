const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Post = require("../models/post");
const Comment = require("../models/comment");

// post is specified by :id in url and comment is specified by :commentid

// POST request to create comment
exports.commentCreate = [
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // create a post object with escaped data
    const comment = new Comment({
      content: req.body.content,
      user: req.user,
      post: req.params.id,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(req.get("referer"));
    });
  },
];

// PUT request to edit comment
exports.commentEdit = [
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    Comment.findByIdAndUpdate(
      req.params.commentid,
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

// POST request to like comment
exports.commentLike = (req, res, next) => {
  // https://medium.com/@salonimalhotra1ind/how-to-increment-a-number-value-in-mongoose-785066ba09d8
  Comment.findByIdAndUpdate(
    req.params.commentid,
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
