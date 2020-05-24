const express = require("express");
const router = express.Router({ mergeParams: true }); // https://cedric.tech/blog/expressjs-accessing-req-params-from-child-routers/
const commentsController = require("../controllers/commentsController");

// POST request to create comment
router.post("/new", commentsController.commentCreate);

// PUT request to edit comment
router.put("/:commentid/edit", commentsController.commentEdit);

// PUT request to like comment
router.post("/:commentid/like", commentsController.commentLike);

module.exports = router;
