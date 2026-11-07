export const ROLE_HOME = {
  admin: "/admin/dashboard",
  agronomist: "/agronomist/dashboard",
  user: "/user/dashboard",
};

export const ROLE_LABELS = {
  admin: "Admin",
  agronomist: "Agronomist",
  user: "Farmer",
};

export const getRoleHome = (user) => {
  return ROLE_HOME[user?.role] ?? "/";
};
