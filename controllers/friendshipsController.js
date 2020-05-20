const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Friendship = require("../models/friendship");

// :id is the user id and :friendshipid is the friendship id

// POST request to create friendship
exports.friendshipCreate = (req, res, next) => {
  const friendship = new Friendship({
    user1: req.user,
    user2: req.params.id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.sendStatus(200);
};

// PUT request to update friendship status
exports.friendshipEdit = [
  validator.body("status").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    Friendship.findByIdAndUpdate(
      req.params.friendshipid,
      { status: req.body.status },
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

// DELETE request to delete friendship
exports.friendshipDelete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.friendshipid, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  });
};

// GET request for all friendships of a specific user
exports.allFriendsForUser = (req, res, next) => {
  Friendship.find({ user1: req.params.id }).exec((err, friends) => {
    if (err) {
      return next(err);
    }
    return res.json(friends);
  });
};
