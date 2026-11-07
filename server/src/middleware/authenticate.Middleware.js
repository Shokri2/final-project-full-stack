import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required.",
    });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET, {
      issuer: "my-api",
      audience: "my-client",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }

  if (
    payload.type !== "access" ||
    payload.id === undefined ||
    payload.id === null
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, role, is_active
       FROM users
       WHERE id = $1`,
      [payload.id],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated.",
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
