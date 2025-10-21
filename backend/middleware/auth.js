import jwt from "jsonwebtoken";

export const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ msg: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  };
};

// Role-specific middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.userData) {
      return res.status(401).json({ msg: "User data not available" });
    }
    
    if (!roles.includes(req.userData.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    
    next();
  };
};
