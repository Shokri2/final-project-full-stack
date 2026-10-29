import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
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

  try {
    const payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET, {
      issuer: "my-api",
      audience: "my-client",
    });

    if (
      payload.type !== "access" ||
      payload.id === undefined ||
      payload.id === null ||
      !["admin", "user"].includes(payload.role)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    return next();
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
};
