const { verifyToken } = require("../utils/jwt.utils");

module.exports = function restrictAccess(allowedRoles = []) {
  return (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && typeof req.headers.authorization === "string") {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login again or create a new account.",
      });
    }

    try {
      const verifiedUser = verifyToken(token);
      if (!verifiedUser) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (!allowedRoles.includes(verifiedUser.role)) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      req.user = verifiedUser;
      next();
    } catch (err) {
      console.error("Auth error:", err.message);
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};