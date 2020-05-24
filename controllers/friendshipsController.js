const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Friendship = require("../models/friendship");

// POST request to send friend request (create friendship wityh a status of pending)
exports.friendshipCreate = (req, res, next) => {
  const friendship = new Friendship({
    user1: req.user._id,
    user2: req.params.id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.redirect("/");
};

// POST request to accept friend request (change friendship status to accepted)
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

// GET request for all friendships of a specific user
exports.allFriendsForUser = (req, res, next) => {
  Friendship.find({ user1: req.params.id }).exec((err, friends) => {
    if (err) {
      return next(err);
    }
    return res.json(friends);
  });
};
