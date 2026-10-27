import {
  getAllUsers,
  getUserById,
  deletUserById,
  updateUser,
  updateUserStatus,
} from "../model/user.Model.js";

// Get all users: admins only (protected in Routes)
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get a specific user: users can view their own profile, admins can view any profile
export const getUser = async (req, res) => {
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
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete a user: admins only (protected in Routes)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deletUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update a user: users can update their own profile, admins can update any profile
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        message: "You can only update your own profile.",
      });
    }

    // Only allow profile fields; do not accept role or status from the request
    const { fname, lname, email, avatar } = req.body;

    const user = await updateUser({
      id,
      fname,
      lname,
      email,
      avatar,
      updated_at: new Date(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update user status: admins only (protected in Routes)
export const updateUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const user = await updateUserStatus(id, status);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
