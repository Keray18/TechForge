export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value || value.trim() === "") return `${label} is required.`;
  return null;
} 