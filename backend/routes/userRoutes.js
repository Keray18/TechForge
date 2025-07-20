const express = require("express");
const { registerUser, loginUser, verifyUser } = require("../controllers/userControllers");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later."
});


router.post("/register", authLimiter, registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);

// Debug endpoint to check user permissions
router.get('/debug', protect, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            role: req.user.role,
            permissions: req.user.permissions,
            isActive: req.user.isActive,
            verified: req.user.verified
        }
    });
});

module.exports = router;
