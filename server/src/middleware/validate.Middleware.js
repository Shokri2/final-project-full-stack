export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.details.map((item) => ({
          field: item.path.join(""),
          message: item.message,
        })),
      });
    }

    req[property] = value;
    next();
  };
};
