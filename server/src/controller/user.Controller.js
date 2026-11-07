import bcrypt from "bcrypt";
import {
  getUserById,
  updateUser,
  getUserPasswordById,
  updateUserPassword,
} from "../model/user.Model.js";
import { revokeAllUserRefreshTokenSessions } from "../model/refreshToken.Model.js";
import { logActivity } from "../utils/activityLog.js";

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        message: "You can only access your own profile.",
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        message: "You can only update your own profile.",
      });
    }

    const { name, phone, avatar } = req.body;

    const user = await updateUser({
      id,
      name,
      phone,
      avatar,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await logActivity({
      userId: req.user.id,
      action: "USER_PROFILE_UPDATED",
      entityType: "user",
      entityId: user.id,
      ip: req.ip,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await getUserPasswordById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashed_password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const hashed_password = await bcrypt.hash(newPassword, 12);

    await updateUserPassword(req.user.id, hashed_password);

    await revokeAllUserRefreshTokenSessions(
      req.user.id,
      req.cookies?.refreshTokens ?? null,
    );

    await logActivity({
      userId: req.user.id,
      action: "PASSWORD_CHANGED",
      entityType: "user",
      entityId: req.user.id,
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
