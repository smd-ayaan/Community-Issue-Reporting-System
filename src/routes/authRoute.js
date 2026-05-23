const express = require("express");
const { authLimiter } = require("../middleware/rateLimiter");
const { signup, signupAdmin,  login } = require("../controllers/authController");

const router = express.Router();
/*
router.post("/signup", signup);
router.post("/signup-admin", signupAdmin);
router.post("/login", login);
*/

router.post("/signup", authLimiter, signup);
router.post("/signup-admin", authLimiter, signupAdmin);
router.post("/login", authLimiter, login);

module.exports = router;


