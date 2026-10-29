import { createUser, findUserByEmail } from "../model/auth.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAcessTokens, generateRefreshTokens } from "../utils/token.js";

import {
  createRefreshTokenSession,
  findRefreshTokenSession,
  rotateRefreshTokenSession,
  revokeRefreshTokenSession,
} from "../model/refreshToken.Model.js";

// ------------------- Register -------------------
export const createUserController = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUsers = await findUserByEmail({
      email: normalizedEmail,
    });

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const newUser = await createUser({
      name: normalizedName,
      email: normalizedEmail,
      hashed_password,
      role: "user",
      avatar: avatar || null,
    });

    if (!newUser) {
      return res.status(500).json({
        message: "Something went wrong while creating the account.",
      });
    }

    const {
      hashed_password: _passwordHash,
      password: _password,
      ...safeUser
    } = newUser;

    return res.status(201).json({
      message: "Account created successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ------------------- Login -------------------
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUsers = await findUserByEmail({
      email: normalizedEmail,
    });

    if (existingUsers.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const userRecord = existingUsers[0];

    const isMatch = await bcrypt.compare(password, userRecord.hashed_password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (userRecord.status !== "approved") {
      return res.status(403).json({
        message: "This account is not approved.",
      });
    }

    const accessTokens = generateAcessTokens(userRecord);
    const refreshTokens = generateRefreshTokens(userRecord);

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await createRefreshTokenSession({
      userId: userRecord.id,
      refreshToken: refreshTokens,
      expiresAt: refreshTokenExpiresAt,
    });

    res.cookie("refreshTokens", refreshTokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    const safeUser = {
      id: userRecord.id,
      name: userRecord.name,
      role: userRecord.role,
      status: userRecord.status,
      avatar: userRecord.avatar,
      email: userRecord.email,
    };

    return res.status(200).json({
      message: "Login successful.",
      user: safeUser,
      accessTokens,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ------------------- Refresh Access Token -------------------
export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshTokens;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required.",
      });
    }

    let payload;

    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, {
        issuer: "my-api",
        audience: "my-client",
      });
    } catch {
      res.clearCookie("refreshTokens", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });

      return res.status(401).json({
        message: "Invalid or expired refresh token.",
      });
    }

    if (
      !payload ||
      payload.type !== "refresh" ||
      payload.id === undefined ||
      payload.id === null
    ) {
      res.clearCookie("refreshTokens", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });

      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    const session = await findRefreshTokenSession(refreshToken);

    if (!session || String(session.user_id) !== String(payload.id)) {
      res.clearCookie("refreshTokens", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });

      return res.status(401).json({
        message: "Refresh token session is invalid or expired.",
      });
    }

    if (session.status !== "approved") {
      res.clearCookie("refreshTokens", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });

      return res.status(403).json({
        message: "This account is not approved.",
      });
    }

    const user = {
      id: session.user_id,
      role: session.role,
    };

    const newAccessToken = generateAcessTokens(user);
    const newRefreshToken = generateRefreshTokens(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const rotated = await rotateRefreshTokenSession({
      oldRefreshToken: refreshToken,
      newRefreshToken,
      expiresAt,
    });

    if (!rotated) {
      res.clearCookie("refreshTokens", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });

      return res.status(401).json({
        message: "Refresh token session is no longer valid.",
      });
    }

    res.cookie("refreshTokens", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.status(200).json({
      message: "Token refreshed successfully.",
      accessTokens: newAccessToken,
    });
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ------------------- Logout -------------------
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshTokens;

    if (refreshToken) {
      await revokeRefreshTokenSession(refreshToken);
    }

    res.clearCookie("refreshTokens", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to log out.",
    });
  }
};
