const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// POST request to create post
router.post("/new", postsController.postCreate);

// POST request to like post
router.post("/:id/like", postsController.postLike);

module.exports = router;
