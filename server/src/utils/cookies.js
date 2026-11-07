const isProduction = () => process.env.NODE_ENV === "production";

const refreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/api/auth",
  };
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshTokens", refreshToken, {
    ...refreshCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshTokens", refreshCookieOptions());
};
