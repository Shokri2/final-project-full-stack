import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateAcessTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      type: "access",
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: "my-api",
      audience: "my-client",
    },
  );
};

export const generateRefreshTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: "refresh",
      jti: crypto.randomUUID(),
    },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "my-api",
      audience: "my-client",
    },
  );
};

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
