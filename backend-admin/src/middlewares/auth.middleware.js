const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded.user;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  console.log('User role:', req.role);
  // 2. Check if user exists and if the role is EXACTLY 2
  // We use == to handle both string '2' or number 2 coming from the JWT
  if (req.role && req.role == 2) {
    return next(); // Role is 2, allow them to proceed
  }

  // 3. If role is not 2, or user doesn't exist, block access
  return res.status(403).json({
    message: 'Access Denied: You do not have the required permissions.'
  });
};

module.exports = {
  verifyToken,
  isAdmin
};
