import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET, {
      issuer: "my-api",
      audience: "my-client",
    });

    if (payload.type !== "access" || !payload.id || !payload.role) {
      return res.status(401).json({
        message: "Invalid access token.",
      });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired access token.",
      });
    }

    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// Check the user's role
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};
