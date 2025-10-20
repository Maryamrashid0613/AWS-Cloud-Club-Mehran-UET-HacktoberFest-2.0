import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js"; // we’ll create this model earlier or later

// ✅ Verify if user is logged in (JWT Auth)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the header contains the Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token (remove 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move to next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// ✅ Check if user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied — Admins only");
  }
};

// ✅ Check if user is an Instructor
const instructor = (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied — Instructors only");
  }
};

export { protect, admin, instructor };
