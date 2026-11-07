import Joi from "joi";

export const paginationQuery = (sortFields, defaultSort, defaultLimit = 10) => {
  return {
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "page must be a number.",
      "number.min": "page must be at least 1.",
    }),
    limit: Joi.number().integer().min(1).max(100).default(defaultLimit).messages({
      "number.base": "limit must be a number.",
      "number.min": "limit must be at least 1.",
      "number.max": "limit cannot exceed 100.",
    }),
    search: Joi.string().trim().max(100).allow("").default(""),
    sort: Joi.string()
      .valid(...sortFields)
      .default(defaultSort)
      .messages({
        "any.only": `sort must be one of: ${sortFields.join(", ")}.`,
      }),
    order: Joi.string().lowercase().valid("asc", "desc").default("desc").messages({
      "any.only": "order must be asc or desc.",
    }),
  };
};

export const getOffset = ({ page, limit }) => {
  return (page - 1) * limit;
};

export const toSearchPattern = (search) => {
  return `%${search.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
};

export const buildPagination = ({ page, limit }, total) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
};

export const createWhereBuilder = () => {
  const conditions = [];
  const values = [];

  return {
    add(sql, value) {
      values.push(value);
      conditions.push(sql.replaceAll("?", `$${values.length}`));
    },
    addRaw(sql) {
      conditions.push(sql);
    },
    where() {
      return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    },
    values,
  };
};
