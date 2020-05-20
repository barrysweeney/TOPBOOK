const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// GET request for all posts
router.get("/", postsController.allPosts);

// POST request to create post
router.post("/new", postsController.postCreate);

// PUT request to edit post
router.put("/:id/edit", postsController.postEdit);

// DELETE request to delete post
router.delete("/:id/delete", postsController.postDelete);

// PUT request to like post
router.put("/:id/like", postsController.postLike);

module.exports = router;
