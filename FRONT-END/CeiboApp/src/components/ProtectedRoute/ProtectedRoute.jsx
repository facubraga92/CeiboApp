import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  onlyAdmin = false,
  onlyManager = false,
  onlyContributor = false,
}) => {
  const user = useSelector((state) => state.user);
  const { role } = user;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isContributor = role === "consultor";

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (onlyAdmin && !isAdmin) return <Navigate to="/" replace/>;
  if (onlyManager && (!isAdmin || !isManager)) return <Navigate to="/" replace/>;
  if (onlyContributor && (!isAdmin || !isManager || !isContributor))
    return <Navigate to="/" replace/>;

  return children ? children : <Outlet />;
};
