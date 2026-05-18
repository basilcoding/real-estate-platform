import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// OPTIONAL: For future multi-role support (if needed)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Single company - all authenticated users are admins
    // This middleware can be removed or kept for future use
    next();
  };
};