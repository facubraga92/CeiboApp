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
  onlyPartner = false,
}) => {
  const token = getCookieValue("token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  const user = jwtDecode(token);

  const { role, isValidated } = user;
  if (!isValidated) return <Navigate to="/InvalidAccount" replace />;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isConsultor = role === "consultor";
  const isManagerOrConsultor = role === "consultor" || role === "manager";
  const isPartner = role === "socio";

  if (onlyAdmin && !isAdmin) return <Navigate to="/projects" replace />;
  if (onlyManager && !isManager) return <Navigate to="/" replace />;
  if (onlyConsultor && !isConsultor) return <Navigate to="/" replace />;
  if (onlyManajerOrConsultor && !isManagerOrConsultor)
    return <Navigate to="/" replace />;
  if (onlyPartner && !isPartner) return <Navigate to="/" replace />;

  if (isAdmin && location.pathname === "/") {
    return <Navigate to="/admin/members" replace />;
  } else if (role === "manager" && location.pathname === "/") {
    return <Navigate to="/projects" replace />;
  } else if (role === "consultor" && location.pathname === "/") {
    return <Navigate to="/projects" replace />;
  } else if (role === "socio" && location.pathname === "/") {
    return <Navigate to="/projects" replace />;
  }
  return children ? children : <Outlet />;
};
