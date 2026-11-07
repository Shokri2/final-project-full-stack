import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  deletUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  replaceAgronomistSpecialties,
  countActiveAdmins,
  getUserPasswordById,
  updateUserPassword,
} from "../model/user.Model.js";
import { findUserByEmail } from "../model/auth.Model.js";
import { countExistingCategories } from "../model/categories.Model.js";
import { revokeAllUserRefreshTokenSessions } from "../model/refreshToken.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";

const checkCategoriesExist = async (categoryIds = []) => {
  if (categoryIds.length === 0) {
    return true;
  }

  const found = await countExistingCategories(categoryIds);

  return found === categoryIds.length;
};

export const getUsers = async (req, res, next) => {
  try {
    const { users, total } = await getAllUsers(req.query);

    return res.status(200).json({
      users,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

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

export const createUserController = async (req, res, next) => {
  const { name, email, phone, password, role, specialties = [] } = req.body;

  const client = await pool.connect();

  try {
    const existingUsers = await findUserByEmail({ email });

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    if (!(await checkCategoriesExist(specialties))) {
      return res.status(400).json({
        message: "One or more specialty categories do not exist.",
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    await client.query("BEGIN");

    const created = await createUserByAdmin(
      { name, email, phone: phone || null, hashed_password, role },
      client,
    );

    if (role === "agronomist") {
      await replaceAgronomistSpecialties(created.id, specialties, client);
    }

    await logActivity(
      {
        userId: req.user.id,
        action: "USER_CREATED",
        entityType: "user",
        entityId: created.id,
        details: { email, role },
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    const user = await getUserById(created.id);

    return res.status(201).json({
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (String(req.user.id) === String(id)) {
      return res.status(400).json({
        message: "You cannot delete your own account.",
      });
    }

    const user = await deletUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await logActivity({
      userId: req.user.id,
      action: "USER_DELETED",
      entityType: "user",
      entityId: user.id,
      details: { email: user.email },
      ip: req.ip,
    });

    return res.status(200).json({
      message: "User deleted successfully",
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

export const updateUserStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (String(req.user.id) === String(id) && !is_active) {
      return res.status(400).json({
        message: "You cannot deactivate your own account.",
      });
    }

    const user = await updateUserStatus(id, is_active);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!is_active) {
      await revokeAllUserRefreshTokenSessions(user.id);
    }

    await logActivity({
      userId: req.user.id,
      action: is_active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      entityType: "user",
      entityId: user.id,
      ip: req.ip,
    });

    return res.status(200).json({
      message: is_active
        ? "User activated successfully"
        : "User deactivated successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  const { id } = req.params;
  const { role, specialties = [] } = req.body;

  if (String(req.user.id) === String(id)) {
    return res.status(400).json({
      message: "You cannot change your own role.",
    });
  }

  const client = await pool.connect();

  try {
    const existing = await getUserById(id);

    if (!existing) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!(await checkCategoriesExist(specialties))) {
      return res.status(400).json({
        message: "One or more specialty categories do not exist.",
      });
    }

    await client.query("BEGIN");

    if (existing.role === "admin" && role !== "admin") {
      const admins = await countActiveAdmins(client);

      if (admins <= 1) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: "The system must keep at least one active admin.",
        });
      }
    }

    await updateUserRole(id, role, client);

    await replaceAgronomistSpecialties(
      id,
      role === "agronomist" ? specialties : [],
      client,
    );

    await logActivity(
      {
        userId: req.user.id,
        action: "USER_ROLE_CHANGED",
        entityType: "user",
        entityId: Number(id),
        details: { from: existing.role, to: role },
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    const user = await getUserById(id);

    return res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const updateSpecialtiesController = async (req, res, next) => {
  const { id } = req.params;
  const { specialties } = req.body;

  const client = await pool.connect();

  try {
    const existing = await getUserById(id);

    if (!existing) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (existing.role !== "agronomist") {
      return res.status(400).json({
        message: "Specialties can only be set for agronomists.",
      });
    }

    if (!(await checkCategoriesExist(specialties))) {
      return res.status(400).json({
        message: "One or more specialty categories do not exist.",
      });
    }

    await client.query("BEGIN");

    await replaceAgronomistSpecialties(id, specialties, client);

    await logActivity(
      {
        userId: req.user.id,
        action: "AGRONOMIST_SPECIALTIES_UPDATED",
        entityType: "user",
        entityId: Number(id),
        details: { specialties },
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    const user = await getUserById(id);

    return res.status(200).json({
      message: "Specialties updated successfully",
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
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
