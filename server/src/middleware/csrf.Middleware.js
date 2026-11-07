const getAllowedOrigins = () => {
  return (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);
};

export const csrfProtection = (req, res, next) => {
  if (req.get("x-requested-with") !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Missing CSRF protection header.",
    });
  }

  const origin = req.get("origin");

  if (origin && !getAllowedOrigins().includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
  }

  return next();
};

export { getAllowedOrigins };
