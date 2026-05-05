export const formatZodError = (error) => {
  if (!error?.issues) return [];

  return error.issues.map((err) => ({
    field: err.path?.join(".") || "unknown",
    message: err.message,
  }));
};