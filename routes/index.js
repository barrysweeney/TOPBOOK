const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/* GET home page. */
// redirect to login page if not logged in
// if logged in then show timeline
router.get("/", authController.getHomePage);

module.exports = router;
