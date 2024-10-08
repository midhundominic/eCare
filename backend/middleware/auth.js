
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "midhun12345";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token data (userId, email, role)
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


module.exports = authMiddleware;
