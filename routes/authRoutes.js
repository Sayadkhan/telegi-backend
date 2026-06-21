const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// Standard Login & Register
router.post("/register", register);
router.post("/login", login);

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // JWT Token create kora Google login success hole
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Frontend e redirect kora token soho
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  },
);

// Protected Route Example (Shudhu logged in user pabe)
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

// Admin Route Example (Shudhu admin pabe)
router.get("/admin-data", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

module.exports = router;
