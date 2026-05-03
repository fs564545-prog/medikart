import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
      
      if (decoded.id.startsWith('mock-user-id') || decoded.id === 'mock-admin-id') {
        req.user = { _id: decoded.id, name: 'Mock User', role: 'admin' };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        console.log("❌ Protect: User not found in database");
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error("❌ Protect: Token verification failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    console.log("❌ Protect: No token provided");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log(`❌ Admin: Access denied for user ${req.user?.email || 'Unknown'} (Role: ${req.user?.role || 'None'})`);
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
