import api from "./api"; // axios instance

export const checkUserRole = () => {
  return api.get("/auth/check-role");
};
