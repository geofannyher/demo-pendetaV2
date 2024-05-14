export const saveSession = (token: string) => {
  localStorage.setItem("idPendetaV2", token);
};

export const getSession = () => {
  return localStorage.getItem("idPendetaV2");
};

export const clearSession = () => {
  localStorage.removeItem("idPendetaV2");
  localStorage.removeItem("role");
};
