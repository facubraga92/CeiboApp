import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  onlyAdmin = false,
  onlyManager = false,
  onlyConsultor = false,
}) => {
  const user = useSelector((state) => state.user);
  const { role } = user;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isConsultor = role === "consultor";

  if (!user || !user.id) {
    return <Navigate to={"/login"} replace />;
  }

  if (onlyAdmin && !isAdmin) return <Navigate to="/home" replace />;
  if (onlyManager && !isManager) return <Navigate to="/home" replace />;
  if (onlyConsultor && !isManager && !isConsultor)
    return <Navigate to="/home" replace />;

  return children ? children : <Outlet />;
};
