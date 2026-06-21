const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { redisClient } = require("../config/redis");

// Token verify korar middleware
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Token decode kora
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. Try to get user from Redis Cache
    const cachedUser = await redisClient.get(`user:${decoded.id}`);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // 2. Jodi Redis e na thake, MongoDB theke nibe
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3. User ke Redis e cache kora (3600 seconds = 1 hour er jonno)
    await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user));

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

// Admin verify korar middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
