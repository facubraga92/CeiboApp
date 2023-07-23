import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, userInitialState } from "../../state/user";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/me", {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        dispatch(setUser(response.data));
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/api/users/logout", null, {
        withCredentials: true,
        credentials: "include",
      })
      .then((user) => {
        dispatch(setUser(userInitialState));
        localStorage.removeItem("user");
        navigate("/login");
      });
  };
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
      <div className="container col-12">
        <Link className="navbar-brand" to="/home">
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
            <li className="nav-item">
              <Link to="/home" className="nav-link">
                {user.role === "manager" ? "Home" : "Inicio"}
              </Link>
            </li>
            {user.email ? (
              <>
                {user.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin/members" className="nav-link">
                        Administrar Miembros
                      </Link>
                    </li>

                    <li>
                      <Link to="/profile" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
                {user.role === "manager" && (
                  <>
                    <li className="nav-item">
                      <Link to="/projects/add" className="nav-link">
                        Crear Proyecto
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/partners" className="nav-link">
                        Socios
                      </Link>
                    </li>

                    <li>
                      <Link to="/profile" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
                {user.role === "consultor" && (
                  <>
                    <li>
                      <Link to="/formNovedades" className="nav-link">
                        Crear Novedad
                      </Link>
                    </li>

                    <li>
                      <Link to="/profile" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
                {user.role === "socio" && (
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
            {user.email ? (
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
