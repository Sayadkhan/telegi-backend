const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const passport = require("passport");

dotenv.config();

// Initialize App
const app = express();
app.use(express.json());

// Connect Databases
connectDB();
connectRedis();

// Passport Middleware
require("./config/passport");
app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
