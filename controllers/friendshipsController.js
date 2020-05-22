const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Friendship = require("../models/friendship");

// POST request to create friendship
exports.friendshipCreate = (req, res, next) => {
  const friendship = new Friendship({
    user1: req.user._id,
    user2: req.params.id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.sendStatus(200);
};

// POST request to accept friendship status
exports.friendshipEdit = (req, res, next) => {
  Friendship.findByIdAndUpdate(
    req.params.id,
    { status: "Accepted" },
    (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(404);
      }
      return res.redirect("/");
    }
  );
};

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
