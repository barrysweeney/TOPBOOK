const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Post = require("../models/post");
const Friendship = require("../models/friendship");
const Comment = require("../models/comment");

// GET request for all users
exports.allUsers = (req, res, next) => {
  User.find({}).exec((err, userList) => {
    if (err) {
      return next(err);
    }
    res.render("user-list", { userList: userList, user: req.user });
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

// GET request for users timeline - all posts by them and their friends
exports.userTimeline = (req, res, next) => {
  const friends = [];
  async.waterfall(
    [
      (callback) =>
        User.findById(req.user._id).exec((err, user) => {
          if (err) return next(err);
          callback(null, user);
        }),
      (user, callback) =>
        Post.find({ user: req.user._id })
          .populate("user")
          .exec((err, userPosts) => {
            if (err) return next(err);
            callback(null, user, userPosts);
          }),
      (user, userPosts, callback) =>
        Friendship.find({ user1: req.user._id }).exec((err, friendships) => {
          if (err) return next(err);
          if (friendships === null) return next();
          callback(null, user, userPosts, friendships);
        }),
      (user, userPosts, friendships, callback) => {
        Friendship.find({ user2: req.user._id }).exec(
          (err, moreFriendships) => {
            if (err) return next(err);
            if (moreFriendships === null) return next();
            friendships = friendships.concat(moreFriendships);
            callback(null, user, userPosts, friendships);
          }
        );
      },
      (user, userPosts, friendships, callback) => {
        function getFriends() {
          return new Promise((resolve, reject) => {
            if (friendships.length <= 0) resolve();

            for (let i = 0; i < friendships.length; i++) {
              if (friendships[i].user1.equals(req.user._id)) {
                User.findById(friendships[i].user2).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);

                  friends.push(user);

                  if (friends.length === friendships.length) resolve();
                });
              } else {
                User.findById(friendships[i].user1).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);

                  friends.push(user);

                  if (friends.length === friendships.length) resolve();
                });
              }
            }
          });
        }
        getFriends().then(() =>
          callback(null, user, userPosts, friendships, friends)
        );
      },
      (user, userPosts, friendships, friends, callback) => {
        const friendsPosts = [];
        function getFriendsPosts() {
          return new Promise((resolve, reject) => {
            if (friends.length <= 0) resolve();
            for (let i = 0; i < friends.length; i++) {
              Post.find({ user: friends[i].id }).exec((err, posts) => {
                if (err) return next(err);

                friendsPosts.push(...posts);
                if (i === friendships.length - 1) resolve();
              });
            }
          });
        }
        getFriendsPosts().then(() =>
          callback(null, user, userPosts, friendships, friends, friendsPosts)
        );
      },
      (user, userPosts, friendships, friends, friendsPosts, callback) => {
        const posts = userPosts.concat(friendsPosts);
        Comment.find({}).exec((err, comments) => {
          if (err) return next(err);
          callback(null, { user, posts, comments });
        });
      },
    ],
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("timeline", {
        posts: results.posts,
        user: results.user,
        comments: results.comments,
      });
    }
  );
};

// GET request for profile of user - user details and their posts
exports.userProfile = (req, res, next) => {
  async.waterfall(
    [
      (callback) =>
        User.findById(req.params.id).exec((err, user) => {
          if (err) return next(err);

          callback(null, user);
        }),
      (user, callback) =>
        Post.find({ user: req.params.id })
          .populate("user")
          .exec((err, userPosts) => {
            if (err) return next(err);

            callback(null, user, userPosts);
          }),
      (user, userPosts, callback) =>
        Comment.find({ user: req.params.id }).exec((err, comments) => {
          if (err) return next(err);

          callback(null, user, userPosts, comments);
        }),
      (user, userPosts, comments, callback) =>
        Friendship.find({ user1: req.user._id }).exec((err, friendships) => {
          if (err) return next(err);

          callback(null, user, userPosts, comments, friendships);
        }),
      (user, userPosts, comments, friendships, callback) =>
        Friendship.find({ user2: req.user._id }).exec(
          (err, moreFriendships) => {
            if (err) return next(err);
            friendships = friendships.concat(moreFriendships);
            callback(null, user, userPosts, comments, friendships);
          }
        ),

      (user, userPosts, comments, friendships, callback) => {
        const friends = [];
        function getFriends() {
          return new Promise((resolve, reject) => {
            if (friendships.length <= 0) resolve();

            for (let i = 0; i < friendships.length; i++) {
              if (friendships[i].user1.equals(req.user._id)) {
                User.findById(friendships[i].user2).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);

                  friends.push(user);

                  if (i === friendships.length - 1) resolve();
                });
              } else {
                User.findById(friendships[i].user1).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);

                  friends.push(user);

                  if (i === friendships.length - 1) resolve();
                });
              }
            }
          });
        }
        getFriends().then(() =>
          callback(null, user, userPosts, comments, friendships, friends)
        );
      },

      (user, userPosts, comments, friendships, friends, callback) => {
        User.findById(req.params.id).exec((err, user) => {
          if (err) return next(err);
          if (user === null) return res.sendStatus(404);
          callback(null, {
            user,
            userPosts,
            comments,
            friends,
            user,
            friendships,
          });
        });
      },
    ],
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user === null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      // can't make friend request to yourself or if you already made or ecieved a request from the user
      let canMakeFriendRequest =
        req.user._id.toString() !== req.params.id.toString();
      results.friends.forEach((friend) => {
        if (friend.equals(results.user)) {
          canMakeFriendRequest = false;
        }
      });

      res.render("profile", {
        canMakeFriendRequest: canMakeFriendRequest,
        userProfile: results.user,
        posts: results.userPosts,
        comments: results.comments,
        user: req.user,
      });
    }
  );
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

// GET request for logged in users friend requests
exports.userFriendRequests = (req, res, next) => {
  const friendRequests = [];
  async.waterfall(
    [
      (callback) =>
        Friendship.find({ user2: req.user._id }).exec((err, friendships) => {
          if (err) return next(err);

          callback(null, friendships);
        }),

      (friendships, callback) => {
        function getFriends() {
          return new Promise((resolve, reject) => {
            if (friendships.length <= 0) resolve();

            for (let i = 0; i < friendships.length; i++) {
              User.findById(friendships[i].user1).exec((err, user) => {
                if (err) return next(err);
                if (user === null) return res.sendStatus(404);
                if (friendships[i].status == "Pending") {
                  friendRequests.push({
                    user: user,
                    status: "Pending",
                    id: friendships[i].id,
                  });
                }
                if (i === friendships.length - 1) resolve();
              });
            }
          });
        }
        getFriends().then(() => callback(null, friendRequests));
      },
    ],
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("friendRequests", {
        friendRequests: results,
        user: req.user,
      });
    }
  );
};

// GET request for users friend list
exports.userFriends = (req, res, next) => {
  const friends = [];
  async.waterfall(
    [
      (callback) =>
        Friendship.find({ user1: req.params.id }).exec((err, friendships) => {
          if (err) return next(err);

          callback(null, friendships);
        }),
      (friendships, callback) =>
        Friendship.find({ user2: req.params.id }).exec(
          (err, moreFriendships) => {
            if (err) return next(err);
            friendships = friendships.concat(moreFriendships);
            callback(null, friendships);
          }
        ),

      (friendships, callback) => {
        function getFriends() {
          return new Promise((resolve, reject) => {
            if (friendships.length <= 0) resolve();

            for (let i = 0; i < friendships.length; i++) {
              if (friendships[i].user1.equals(req.params.id)) {
                User.findById(friendships[i].user2).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);
                  if (friendships[i].status == "Accepted") {
                    friends.push(user);
                  }
                  if (i === friendships.length - 1) resolve();
                });
              } else {
                User.findById(friendships[i].user1).exec((err, user) => {
                  if (err) return next(err);
                  if (user === null) return res.sendStatus(404);
                  if (friendships[i].status == "Accepted") {
                    friends.push(user);
                  }
                  if (i === friendships.length - 1) resolve();
                });
              }
            }
          });
        }
        getFriends().then(() => callback(null, friendships, friends));
      },
      (friendships, friends, callback) => {
        callback(null, friendships, friends);
      },
      (friendships, friends, callback) => {
        User.findById(req.params.id).exec((err, user) => {
          if (err) return next(err);
          if (user === null) return res.sendStatus(404);
          callback(null, { friends, user, friendships });
        });
      },
    ],
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("friendlist", {
        friends: results.friends,
        userProfile: results.user,
        user: req.user,
      });
    }
  );
};
