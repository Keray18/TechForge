const express = require("express");
const { registerUser, loginUser, verifyUser } = require("../controllers/userControllers");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later."
});


router.post("/register", authLimiter, registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);

module.exports = router;
