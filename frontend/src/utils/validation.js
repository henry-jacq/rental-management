
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 3) return "Password must be at least 3 characters";
  return "";
};

export const validateName = (name) => {
  if (!name || !name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
};

export const validateNumber = (value, fieldName = "Value", min = 0) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  return "";
};

export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateOTP = (otp) => {
  if (!otp) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return "";
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};
