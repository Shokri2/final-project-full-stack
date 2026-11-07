export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property] ?? {}, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((item) => ({
          field: item.path.join("."),
          message: item.message,
        })),
      });
    }

    if (property === "query") {
      Object.defineProperty(req, "query", {
        value,
        writable: true,
        configurable: true,
      });
    } else {
      req[property] = value;
    }

    return next();
  };
};
