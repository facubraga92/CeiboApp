import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue, userMe } from "../../utils/api";
import jwtDecode from "jwt-decode";
import { useLocation } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  onlyAdmin = false,
  onlyManager = false,
  onlyConsultor = false,
  onlyManajerOrConsultor = false,
  onlyLogged = false,
}) => {
  const token = getCookieValue("token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  const user = jwtDecode(token);
  const { role, isValidated } = user;
  if (!isValidated) return <Navigate to="/InvalidAccount" replace />;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isConsultor = role === "consultor";
  const isManagerOrConsultor = role === "consultor" || role === "manager";

  if (onlyAdmin && !isAdmin) return <Navigate to="/projects" replace />;
  if (onlyManager && !isManager) return <Navigate to="/home" replace />;
  if (onlyConsultor && !isConsultor) return <Navigate to="/home" replace />;
  if (onlyManajerOrConsultor && !isManagerOrConsultor)
    return <Navigate to="/home" replace />;

  if (isAdmin && location.pathname === "/home") {
    return <Navigate to="/admin/members" replace />;
  } 
  return children ? children : <Outlet />;
};
