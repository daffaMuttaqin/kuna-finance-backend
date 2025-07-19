// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer "))
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = bearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin")
    return res.status(403).json({ message: "Hanya untuk Super Admin" });

  next();
};
