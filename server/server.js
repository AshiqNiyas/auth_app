require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const connectDB = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes"); // Authentication routes
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const cors = require("cors"); // Middleware for Cross-Origin Resource Sharing

const app = express();

// Connect to Database
connectDB(); // Ensure this function does not throw an unhandled error that prevents server startup

// --- IMPORTANT: CORS middleware should be one of the first middlewares ---
// It needs to handle the OPTIONS preflight request before other middlewares or routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // This must be the exact URL of your frontend (e.g., 'https://auth-app-pmtn.vercel.app')
    credentials: true, // Essential for sending/receiving HTTP-only cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Explicitly allow OPTIONS method
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Date",
      "X-Api-Version",
      "X-CSRF-Token", // Include any custom headers your frontend might send
    ],
  })
);

// Middleware for parsing JSON request bodies
app.use(express.json());
// Middleware for parsing cookies
app.use(cookieParser());

// Routes
// All authentication-related routes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);

// Basic route for testing if the API is running
app.get("/", (req, res) => {
  res.send("MERN Auth API is running...");
});

// Global error handling middleware (should be the last middleware)
// This catches any errors thrown in your routes or other middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  // In production, you might send a less verbose error message
  res.status(500).send("Server Error: Something broke!");
});

const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
