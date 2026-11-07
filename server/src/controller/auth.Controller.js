import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import {
  createUser,
  findUserByEmail,
  findCurrentUserById,
  markEmailAsVerified,
  updateLastLogin,
} from "../model/auth.Model.js";
import {
  createRefreshTokenSession,
  findRefreshTokenSession,
  rotateRefreshTokenSession,
  revokeRefreshTokenSession,
} from "../model/refreshToken.Model.js";
import {
  createEmailVerificationToken,
  useEmailVerificationToken,
} from "../model/emailVerification.Model.js";
import {
  generateAcessTokens,
  generateRefreshTokens,
  generateRandomToken,
} from "../utils/token.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookies.js";
import { sendVerificationEmail } from "../utils/email.js";
import { logActivity } from "../utils/activityLog.js";

const EMAIL_VERIFICATION_TTL = 24 * 60 * 60 * 1000;

const toSafeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    is_active: user.is_active,
    email_verified: Boolean(user.email_verified_at ?? user.email_verified),
  };
};

const issueVerificationEmail = async (user, client = pool) => {
  const token = generateRandomToken();

  await createEmailVerificationToken(
    {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL),
    },
    client,
  );

  return token;
};

export const createUserController = async (req, res, next) => {
  const { name, email, phone, password, avatar } = req.body;

  const client = await pool.connect();

  try {
    const existingUsers = await findUserByEmail({ email });

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    await client.query("BEGIN");

    const newUser = await createUser(
      {
        name,
        email,
        phone: phone || null,
        hashed_password,
        avatar: avatar || null,
      },
      client,
    );

    const verificationToken = await issueVerificationEmail(newUser, client);

    await logActivity(
      {
        userId: newUser.id,
        action: "USER_REGISTERED",
        entityType: "user",
        entityId: newUser.id,
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    try {
      await sendVerificationEmail({
        to: newUser.email,
        name: newUser.name,
        token: verificationToken,
      });
    } catch (emailError) {
      console.error("VERIFICATION EMAIL ERROR:", emailError.message);
    }

    return res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your account.",
      user: toSafeUser(newUser),
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const verifyEmailController = async (req, res, next) => {
  const { token } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const usedToken = await useEmailVerificationToken(token, client);

    if (!usedToken) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    await markEmailAsVerified(usedToken.user_id, client);

    await logActivity(
      {
        userId: usedToken.user_id,
        action: "EMAIL_VERIFIED",
        entityType: "user",
        entityId: usedToken.user_id,
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const resendVerificationController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUsers = await findUserByEmail({ email });
    const user = existingUsers[0];

    if (user && user.is_active && !user.email_verified_at) {
      const token = await issueVerificationEmail(user);

      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        token,
      });
    }

    return res.status(200).json({
      message:
        "If this email is registered and not verified yet, a new verification link has been sent.",
    });
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUsers = await findUserByEmail({ email });

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

    if (!userRecord.is_active) {
      return res.status(403).json({
        message: "This account has been deactivated. Please contact support.",
        code: "ACCOUNT_DEACTIVATED",
      });
    }

    if (!userRecord.email_verified_at) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const accessTokens = generateAcessTokens(userRecord);
    const refreshTokens = generateRefreshTokens(userRecord);

    await createRefreshTokenSession({
      userId: userRecord.id,
      refreshToken: refreshTokens,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await updateLastLogin(userRecord.id);

    await logActivity({
      userId: userRecord.id,
      action: "USER_LOGGED_IN",
      entityType: "user",
      entityId: userRecord.id,
      ip: req.ip,
    });

    setRefreshTokenCookie(res, refreshTokens);

    return res.status(200).json({
      message: "Login successful.",
      user: toSafeUser(userRecord),
      accessTokens,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
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
      clearRefreshTokenCookie(res);

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
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    const session = await findRefreshTokenSession(refreshToken);

    if (!session || String(session.user_id) !== String(payload.id)) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        message: "Refresh token session is invalid or expired.",
      });
    }

    if (!session.is_active || !session.email_verified_at) {
      await revokeRefreshTokenSession(refreshToken);
      clearRefreshTokenCookie(res);

      return res.status(403).json({
        message: "This account is not allowed to log in.",
      });
    }

    const user = {
      id: session.user_id,
      role: session.role,
    };

    const newAccessToken = generateAcessTokens(user);
    const newRefreshToken = generateRefreshTokens(user);

    const rotated = await rotateRefreshTokenSession({
      oldRefreshToken: refreshToken,
      newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!rotated) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        message: "Refresh token session is no longer valid.",
      });
    }

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully.",
      accessTokens: newAccessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshTokens;

    if (refreshToken) {
      await revokeRefreshTokenSession(refreshToken);
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = await findCurrentUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};
