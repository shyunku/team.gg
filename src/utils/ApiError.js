export const getApiErrorMessage = (error, fallback = "요청을 처리하지 못했습니다.") => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  return fallback;
};
