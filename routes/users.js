const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

// GET request for all users
router.get("/", ensureLoggedIn(), usersController.allUsers);

// GET request for profile of user (user details and posts)
router.get("/:id/profile", ensureLoggedIn(), usersController.userProfile);

// GET request for users timeline
router.get("/timeline", ensureLoggedIn(), usersController.userTimeline);

// GET request for users friend list
router.get("/:id/friends", ensureLoggedIn(), usersController.userFriends);

// GET request for logged in users friend requests
router.get(
  "/friend-requests",
  ensureLoggedIn(),
  usersController.userFriendRequests
);

module.exports = router;
