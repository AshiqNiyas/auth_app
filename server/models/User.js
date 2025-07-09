const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email addresses are unique
      match: [/.+@.+\..+/, "Please use a valid email address"], // Basic email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Define allowed roles
      default: "user", // Default role for new users
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Middleware to hash the password before saving the user document
UserSchema.pre("save", async function (next) {
  // Only hash if the password field is modified or it's a new document
  if (!this.isModified("password")) {
    next(); // Move to the next middleware/save operation
  }
  const salt = await bcrypt.genSalt(10); // Generate a salt (cost factor 10)
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
