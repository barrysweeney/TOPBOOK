const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST request to log-in
router.post("/log-in", authController.postLogIn);

// POST request to log-out
router.post("/log-out", authController.logOut);

module.exports = router;
