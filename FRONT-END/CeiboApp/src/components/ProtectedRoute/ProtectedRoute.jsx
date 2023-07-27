import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue, userMe } from "../../utils/api";
import jwtDecode from "jwt-decode";

export const ProtectedRoute = ({
  children,
  onlyAdmin = false,
  onlyManager = false,
  onlyConsultor = false,
  onlyLogged = false,
}) => {
  const token = getCookieValue("token");
  if (!token) return <Navigate to="/login" />;

  const user = jwtDecode(token);
  const { role, isValidated } = user;
  if (!isValidated) return <Navigate to="/invalidAccount" replace />;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isConsultor = role === "consultor";

  if (onlyAdmin && !isAdmin) return <Navigate to="/home" replace />;
  if (onlyManager && !isManager) return <Navigate to="/home" replace />;
  if (onlyConsultor && !isConsultor) return <Navigate to="/home" replace />;

  return children ? children : <Outlet />;
};
