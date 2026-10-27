import { createUser, findUserByEmail } from "../model/auth.Model.js";

import bcrypt from "bcrypt";

import { generateAcessTokens, generateRefreshTokens } from "../utils/token.js";

// ------------------- Register -------------------
export const createUserController = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const isExist = await findUserByEmail({
      email: normalizedEmail,
    });

    if (isExist.length !== 0) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    // Public registration always creates a regular user.
    // Never trust a role sent by the frontend.
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

    // Never expose the password hash in the response.
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
      message: "Internal server error",
    });
  }
};

// -------------------------- Login ----------------
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

    const isExist = await findUserByEmail({
      email: normalizedEmail,
    });

    if (isExist.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const userRecord = isExist[0];

    const isMatch = await bcrypt.compare(password, userRecord.hashed_password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const accessTokens = generateAcessTokens(userRecord);
    const refreshTokens = generateRefreshTokens(userRecord);

    res.cookie("refreshTokens", refreshTokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    const safeUser = {
      id: userRecord.id,
      fname: userRecord.fname,
      lname: userRecord.lname,
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
      message: "Internal server error",
    });
  }
};
