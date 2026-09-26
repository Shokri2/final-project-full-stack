import Joi from "joi";



// -------------------categorySchema------------------
export const categorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "any.string": "the  name should be string",
    "any.empty": "you should enter your  name ",
    "any.min": " name must be more than 3 letters",
    "any.max": " name should be less than 15 letters",
  }),

  description: Joi.string().trim().max(200).messages({
    "any.string": "the  name should be string",
    "any.empty": "you should enter your  name ",
  }),
});

