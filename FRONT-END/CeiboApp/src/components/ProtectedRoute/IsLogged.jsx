import { getCookieValue } from "../../utils/api";
import { Navigate } from "react-router-dom";

export const IsLogged = ({ children }) => {
  const token = getCookieValue("token");
  const isLoggedIn = !!token;

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};
