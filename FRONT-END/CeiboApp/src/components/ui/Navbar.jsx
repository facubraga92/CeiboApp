import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, userInitialState } from "../../state/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userMe } from "../../utils/api";
import { envs } from "../../config/env/env.config";

const Navbar = () => {
  const [userE, setUsere] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    const handle = async () => {
      const user = await userMe();
      return setUsere(user);
    };
    handle();
  }, []);

  const handleLogout = async () => {
    const call = await axios.post(`${VITE_BACKEND_URL}/users/logout`, null, {
      withCredentials: true,
      credentials: "include",
    });
    if (call.status == 204) {
      dispatch(setUser(userInitialState));
      localStorage.removeItem("user");
      return navigate("/login");
    }
    return;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container col-12">
        <Link className="navbar-brand" to="/">
          CeiboApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            {userE?.role === "manager" ||
              (userE?.role === "consultor" && (
                <li className="nav-item">
                  <Link to="/Projects" className="nav-link">
                    {userE?.role === "manager" ? "Proyectos" : "Inicio"}
                  </Link>
                </li>
              ))}
            {userE?.email ? (
              <>
                {userE?.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin/members" className="nav-link">
                        Administrar Miembros
                      </Link>
                    </li>
                  </>
                )}
                {userE?.role === "manager" && (
                  <>
                    <li className="nav-item">
                      <Link to="/Projects" className="nav-link">
                        Projectos
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/partners" className="nav-link">
                        Socios
                      </Link>
                    </li>
                  </>
                )}
                {userE?.role === "consultor" && (
                  <>
                    <li className="nav-item">
                      <Link to="/home" className="nav-link">
                        Proyectos
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
                {userE?.role === "socio" && (
                  <>
                    <li>
                      <Link to="/home" className="nav-link">
                        Mis Proyectos
                      </Link>
                    </li>
                    <li>
                      <Link to="/home" className="nav-link">
                        Ver Novedades
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <li className="nav-item">
                <Link
                  to={isLogin ? "/register" : "/login"}
                  className="nav-link"
                >
                  {isLogin ? "Register" : "Login"}
                </Link>
              </li>
            )}
          </ul>
          <div>
            {userE?.email ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/">
                <button className="btn btn-warning">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
