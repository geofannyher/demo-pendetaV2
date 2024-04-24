export const saveSession = (token: string) => {
  localStorage.setItem("idPendeta", token);
};

export const getSession = () => {
  return localStorage.getItem("idPendeta");
};

export const clearSession = () => {
  localStorage.removeItem("idPendeta");
  localStorage.removeItem("role");
};
