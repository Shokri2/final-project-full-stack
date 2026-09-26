import Joi from "joi";



// -------------------register------------------
export const createUserSchema = Joi.object({
  fname: Joi.string().trim().min(3).max(15).required().messages({
    "any.string": "the first name should be string",
    "any.empty": "you should enter your first name ",
    "any.min": "first name must be more than 3 letters",
    "any.max": "first name should be less than 15 letters",
  }),

  lname: Joi.string().trim().min(3).max(15).required().messages({
    "any.string": "the last name should be string",
    "any.empty": "you should enter your last name ",
    "any.min": "last name must be more than 3 letters",
    "any.max": "last name should be less than 15 letters",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$",
      ),
    )
    .required()
    .messages({
      "string.base": "Password must be a text string.",
      "string.empty": "Password cannot be empty.",
      "string.pattern.base":
        "Password must be 8-100 characters long and include at least ...",
      "any.required": "Password is a required field.",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password.",
    "any.required": "Confirm password is a required field.",
    "string.empty": "Confirm password cannot be empty.",
  }),

  role: Joi.string()
    .trim()
    .lowercase()
    .valid("user", "admin", "trader")
    .required()
    .messages({
      "string.base": "Role must be a text string.",
      "string.empty": "Role cannot be empty.",
      "any.only": "Role must be either user, admin, or trader.",
      "any.required": "Role is a required field.",
    }),

  avatar: Joi.string().trim().messages({
    "string.base": "Avatar must be a text string.",
  }),
  
});

// ------------------login-----------------
export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a text string.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is a required field.'
        }),
         password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$",
      ),
    )
    .required()
    .messages({
      "string.base": "Password must be a text string.",
      "string.empty": "Password cannot be empty.",
      "string.pattern.base":
        "Password must be 8-100 characters long and include at least ...",
      "any.required": "Password is a required field.",
    })
  })