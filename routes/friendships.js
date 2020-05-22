const express = require("express");
const router = express.Router({ mergeParams: true }); // https://cedric.tech/blog/expressjs-accessing-req-params-from-child-routers/
const friendshipsController = require("../controllers/friendshipsController");

// POST request to create friendship
router.post("/:id/new", friendshipsController.friendshipCreate);

// POST request to accept friend request
router.post("/:id/accept", friendshipsController.friendshipEdit);

module.exports = router;
