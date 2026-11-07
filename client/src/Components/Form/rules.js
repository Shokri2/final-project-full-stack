export const requiredRule = (label) => ({
  required: `${label} is required.`,
});

export const emailRules = {
  required: "Email is required.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address.",
  },
};

export const passwordRules = {
  required: "Password is required.",
  minLength: { value: 8, message: "Password must be at least 8 characters long." },
  pattern: {
    value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
    message: "Password must contain at least one letter and one number.",
  },
};

export const phoneRules = {
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: "Phone number must contain 7 to 15 digits.",
  },
};

export const lengthRules = (label, min, max, required = true) => ({
  ...(required ? { required: `${label} is required.` } : {}),
  minLength: { value: min, message: `${label} must be at least ${min} characters long.` },
  maxLength: { value: max, message: `${label} cannot exceed ${max} characters.` },
});
