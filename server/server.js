require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const connectDB = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes"); // Authentication routes
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const cors = require("cors"); // Middleware for Cross-Origin Resource Sharing

const app = express();

// Connect to Database
connectDB();

// Middleware
// Parse JSON bodies for incoming requests
app.use(express.json());
// Parse cookies attached to the client request object
app.use(cookieParser());

// CORS configuration
// This is crucial for allowing your frontend (e.g., Vercel deployment) to communicate with your backend (e.g., Render deployment).
// Replace 'http://localhost:3000' with your actual frontend URL in production (e.g., your Vercel URL).
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allowed frontend origin(s)
    credentials: true, // Allow sending and receiving cookies
  })
);

// Routes
// All authentication-related routes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);

// Basic route for testing if the API is running
app.get("/", (req, res) => {
  res.send("MERN Auth API is running...");
});

// Global error handling middleware
// This catches any errors thrown in your routes or other middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send("Something broke!"); // Send a generic error response
});

const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
