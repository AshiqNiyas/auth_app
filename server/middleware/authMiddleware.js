const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (ensure user is authenticated)
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in HTTP-only cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is found, return an unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID embedded in the token and attach it to the request object
    // Exclude the password field for security
    req.user = await User.findById(decoded.id).select("-password");

    // If user is not found (e.g., deleted account), return unauthorized
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error.message);
    // If token verification fails (e.g., expired, invalid signature), return unauthorized
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to authorize users based on their role
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is attached to the request and if their role is included in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `User role ${
            req.user?.role || "unknown"
          } is not authorized to access this route`,
        });
    }
    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = { protect, authorize };
