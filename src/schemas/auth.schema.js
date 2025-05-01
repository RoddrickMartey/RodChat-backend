import Joi from "joi";

export const signUpSchema = Joi.object({
  username: Joi.string().min(8).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 8 characters",
    "string.max": "Username must be at most 20 characters",
    "any.required": "Username is required",
  }),

  firstname: Joi.string().min(2).max(20).required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must be at most 20 characters",
    "any.required": "First name is required",
  }),

  surname: Joi.string().min(2).max(20).required().messages({
    "string.base": "Sur name must be a string",
    "string.empty": "Sur name is required",
    "string.min": "Sur name must be at least 2 characters",
    "string.max": "Sur name must be at most 20 characters",
    "any.required": "Sur name is required",
  }), // Optional: if you want surname to equal firstname

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid email (e.g., example@domain.com)",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 3–30 characters long and contain only letters and numbers",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),

  avatar: Joi.string().uri().optional().messages({
    "string.uri": "Avatar must be a valid image URL",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(8).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 8 characters",
    "string.max": "Username must be at most 20 characters",
    "any.required": "Username is required",
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 3–30 characters long and contain only letters and numbers",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});
