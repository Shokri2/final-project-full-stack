import {
  getAllUsers,
  getUserById,
  deletUserById,
  updateUser,
  updateUserStatus,
} from "../model/user.Model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deletUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;

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

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

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

    res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
