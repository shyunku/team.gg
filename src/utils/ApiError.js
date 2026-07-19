export const getApiErrorMessage = (error, fallback = "요청을 처리하지 못했습니다.") => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  return fallback;
};

export const getCustomGameErrorMessage = (error, fallback = "내전 구성을 변경하지 못했습니다.") => {
  const status = error?.response?.status;
  const serverMessage = getApiErrorMessage(error, "");
  if (status === 403) {
    return serverMessage && !serverMessage.toLowerCase().includes("not creator")
      ? serverMessage
      : "이 내전 구성에서 해당 작업을 수행할 권한이 없습니다.";
  }
  if (status === 423) return serverMessage || "최적의 조합을 계산 중이라 내전 구성을 변경할 수 없습니다.";
  return getApiErrorMessage(error, fallback);
};
