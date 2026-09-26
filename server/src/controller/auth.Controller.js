import { createUser, findUserByEmail } from "../model/auth.Model.js";
import bcrypt from "bcrypt";
import { generateAcessTokens, generateRefreshTokens } from "../utils/token.js";
// -------------------register-----------------
export const createUserController = async (req, res) => {
  try {
    const { fname, lname, email, password, role, avatar } = req.body;
    const isExist = await findUserByEmail({ email });
    if (isExist.length !== 0) {
      return res.status(400).json({ message: "email already exist!" });
    }
    const hashed_password = await bcrypt.hash(password, 12);
    const newUser = await createUser({
      fname,
      lname,
      email,
      hashed_password,
      role,
      avatar,
    });
    if (!newUser) {
      return res.status(400).json({ message: "Something went wrong!" });
    }
    return res
      .status(201)
      .json({ message: "account created successfully", user: newUser });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// --------------------------login----------------

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await findUserByEmail({ email });
    if (isExist.length === 0) {
      return res
        .status(400)
        .json({ message: "You don`t have an account, plesae register" });
    }
    const isMatch = await bcrypt.compare(password, isExist[0].hashed_password);
    if (!isMatch) {
      return res.status(400).json({ message: "password is not correct!" });
    }
    const accessTokens = generateAcessTokens(isExist[0]);
    const refreshTokens = generateRefreshTokens(isExist[0]);

    res.cookie("refreshTokens", refreshTokens, {
      httpsOnly: true,
      secure: process.send.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 1000,
      path: "/api/auth",
    });
    const safeUser = {
      id: isExist[0].id,
      fname: isExist[0].fname,
      lname: isExist[0].lname,
      role: isExist[0].role,
      avatar: isExist[0].avatar,
      email: isExist[0].email,
    };
    return res
      .status(200)
      .json({ message: "login successfully", user: safeUser, accessTokens });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// -----------------------------refreshController---------------------------
export const refreshController = async (req, res) => {
  try {
    const refreshTokens = req.cookie.refreshTokens;
    if (!refreshTokens) {
      return res.status(401).json({ message: "refreshTokens missing!" });
    }
    const payload = jwt.verify(token, process.env.REFRESH_JWT_SECRET, {
      issuer: "my-api",
      audience: "my-client",
    });

    if (payload.type !== "refresh") {
      return res.status(401).json({ message: "invalid tokens type!" });
    }

    const accessTokens = generateAcessTokens(payload);

    return res.status(200).json({ accessTokens });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
