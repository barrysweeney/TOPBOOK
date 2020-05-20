const express = require("express");
const router = express.Router({ mergeParams: true }); // https://cedric.tech/blog/expressjs-accessing-req-params-from-child-routers/
const friendshipsController = require("../controllers/friendshipsController");

// POST request to create friendship
router.post("/new", friendshipsController.friendshipCreate);

// PUT request to update friendship status
router.put("/:id/edit", friendshipsController.friendshipEdit);

// DELETE request to delete friendship
router.delete("/:id/delete", friendshipsController.friendshipDelete);

// GET request for all friendships of a specific user
router.get("/", friendshipsController.allFriendsForUser);

module.exports = router;
