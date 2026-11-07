const databaseErrors = {
  23505: [409, "A record with this value already exists."],
  23503: [409, "This record is linked to other data and cannot be changed or deleted."],
  23001: [409, "This record is linked to other data and cannot be changed or deleted."],
  23514: [400, "The data violates a validation rule."],
  23502: [400, "A required field is missing."],
  "22P02": [400, "Invalid value format."],
  22001: [400, "A value is too long."],
};

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code && databaseErrors[error.code]) {
    const [status, message] = databaseErrors[error.code];

    return res.status(status).json({
      success: false,
      message,
    });
  }

  if (error.name === "MulterError") {
    const uploadMessages = {
      LIMIT_FILE_SIZE: "Each image must be 5 MB or smaller.",
      LIMIT_FILE_COUNT: "You can upload up to 3 images.",
      LIMIT_UNEXPECTED_FILE: "Images must be sent in the 'images' field (max 3).",
    };

    return res.status(400).json({
      success: false,
      message: uploadMessages[error.code] || "File upload failed.",
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Request body is not valid JSON.",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
  }

  const status = error.status || 500;

  if (status >= 500 && process.env.NODE_ENV !== "test") {
    console.error(`ERROR [${req.method} ${req.originalUrl}]:`, error);
  }

  return res.status(status).json({
    success: false,
    message: status < 500 ? error.message : "Internal server error.",
  });
};
