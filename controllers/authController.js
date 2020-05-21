const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Frienship = require("../models/friendship");
const Posts = require("../models/post");
