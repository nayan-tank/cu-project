// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const checkAdminRole = (req, res, next) => {
  const tokenCookie = req?.cookies?.token;
  // console.log("tokenCookie", tokenCookie)

  if (!tokenCookie) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Token cookie not found.",
    });
  }

  try {
    const user = jwt.verify(tokenCookie, process.env.JWT_SECRET)

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid token cookiee.",
    });
  }
};


const UserAuthMiddleware = (req, res, next) => {
  const tokenCookie = req?.cookies?.token;
  // console.log("tokenCookie", tokenCookie)

  if (!tokenCookie) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Token cookie not found.",
    });
  }

  try {
    // const { userId } = req.params;
    const user = jwt.verify(tokenCookie, process.env.JWT_SECRET)
    if (!user || user.role !== "user" ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Users only.",
      });
    }
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Invalid token cookie.`
    });
  }
};

module.exports = { checkAdminRole, UserAuthMiddleware };
