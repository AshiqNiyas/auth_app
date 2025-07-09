const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import our middleware

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the given email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user (password will be hashed by pre-save hook in User model)
    user = await User.create({
      email,
      password,
      // role defaults to 'user' as defined in the schema
    });

    // Generate a JWT and set it as an HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Lax", // Protects against CSRF attacks, adjust to 'None' if truly cross-site and secure: true
      maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error during registration");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (via HTTP-only cookie)
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT and set it as an HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error during login");
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Private (requires authentication to clear cookie)
router.post("/logout", protect, (req, res) => {
  // Clear the 'token' cookie by setting an expired cookie
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user's details (for frontend auth status check)
// @access  Private (requires authentication)
router.get("/me", protect, async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error fetching user data");
  }
});

// @route   GET /api/auth/admin-data
// @desc    Get admin-specific data (requires admin role)
// @access  Private (Admin only)
router.get("/admin-data", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome to the Admin Data!",
    data: "Sensitive admin information accessible only to administrators.",
  });
});

// @route   GET /api/auth/user-data
// @desc    Get user-specific data (requires user or admin role)
// @access  Private (User or Admin)
router.get("/user-data", protect, authorize("user", "admin"), (req, res) => {
  res.json({
    message: "Welcome to the User Data!",
    data: "Personal user information accessible to authenticated users.",
  });
});

module.exports = router;
