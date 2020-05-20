const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// GET request for all users
router.get("/", usersController.allUsers);

// GET request for user
router.get("/:id", usersController.userGet);

// GET request for profile of user (user details and posts)
router.get("/:id/profile", usersController.userProfile);

// POST request to create user
router.post("/create", usersController.userCreate);

// DELETE request to delete user
router.delete("/:id/delete", usersController.userDelete);

// PUT request to update user
router.put("/:id", usersController.userUpdate);

// GET request for all posts by a specific user
router.get("/:id/posts", usersController.userPosts);

module.exports = router;
