export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error?.response) {
    return error?.message === "Network Error"
      ? "Cannot reach the server. Check your connection and try again."
      : fallback;
  }

  const data = error.response.data;

  if (data?.errors?.length === 1) {
    return data.errors[0].message;
  }

  return typeof data?.message === "string" ? data.message : fallback;
};

export const getErrorCode = (error) => {
  return error?.response?.data?.code ?? null;
};

export const applyFieldErrors = (error, setError) => {
  const errors = error?.response?.data?.errors;

  if (!Array.isArray(errors)) {
    return false;
  }

  errors.forEach((item) => {
    if (item.field) {
      setError(item.field, { type: "server", message: item.message });
    }
  });

  return errors.length > 0;
};
