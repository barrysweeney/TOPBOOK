const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Post = require("../models/post");
const Comment = require("../models/comment");

// post is specified by :id in url and comment is specified by :commentid

// GET request for all comments for a specific post
exports.allComments = (req, res, next) => {
  async.parallel(
    {
      commentList: (callback) =>
        Comment.find({ post: req.params.id }).exec(callback),
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.commentList === null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.json(results.commentList);
    }
  );
};

// DELETE request to delete comment
exports.commentDelete = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.commentid, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  });
};

// POST request to create comment
exports.commentCreate = [
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // create a post object with escaped data
    const post = new Post({
      content: req.body.content,
      user: req.user,
      post: req.params.id,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
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

// PUT request to like comment
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
      return res.sendStatus(200);
    }
  );
};
