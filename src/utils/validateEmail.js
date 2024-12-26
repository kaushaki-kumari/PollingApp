export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Enter a valid email';
  }
  return '';
};
