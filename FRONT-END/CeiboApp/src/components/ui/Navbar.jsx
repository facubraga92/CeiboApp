import { Navbar, Avatar } from "@nextui-org/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, userInitialState } from "../../state/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserByToken, userMe } from "../../utils/api";
import { envs } from "../../config/env/env.config";
import { FiLogOut } from "react-icons/fi";

export default function NavBar() {
  const path = useLocation().pathname.slice(1);
  const [userE, setUsere] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { VITE_BACKEND_URL } = envs;
  const userInitials = `${userE?.name?.slice(0, 1)}${userE?.lastName?.slice(
    0,
    1
  )}`;

  useEffect(() => {
    const handle = async () => {
      const user = getUserByToken();
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

  const navbarOptions = [
    {
      label: "Proyectos",
      path: "/projects",
      role: ["manager", "consultor"],
    },
    { label: "Socios", path: "/partners", role: "manager" },
    { label: "Ver Novedades", path: "/projects", role: ["socio"] },
    { label: "Clientes", path: "/customers", role: "manager" },
  ];

  return (
    <Navbar isBordered variant="sticky">
      <Link to="/">
        <Navbar.Brand>
          <img src="/ceibo-red.png" style={{ height: "45px" }} alt="" />
        </Navbar.Brand>
      </Link>
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        {navbarOptions.map(
          (option, index) =>
            userE?.email &&
            option.role.includes(userE.role) && (
              <Navbar.Item key={option.label}>
                <Link style={{ color: "red" }} to={`${option.path}`}>
                  {option.label}
                </Link>
              </Navbar.Item>
            )
        )}
      </Navbar.Content>
      <Navbar.Content className="mx-4">
        {!userE?.email && (
          <>
            {path != "login" && (
              <Link to="/login">
                <Navbar.Item color="inherit" className="d-none d-md-block">
                  <button type="button" className="btn btn-outline-danger">
                    Iniciar sesión
                  </button>
                </Navbar.Item>
              </Link>
            )}
            {path != "register" && (
              <Link to="/register">
                <Navbar.Item className="d-none d-md-block">
                  <button type="button" className="btn btn-outline-danger">
                    Registrarse
                  </button>
                </Navbar.Item>
              </Link>
            )}
          </>
        )}
        {userE?.email && (
          <div className="d-flex">
            <Avatar
              className="d-none d-md-block"
              title="Perfil"
              text={userInitials}
              color="error"
              textColor="white"
            />

            <button
              className="mx-2 btn btn-outline-danger d-none d-md-block"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <FiLogOut /> Log out
            </button>
          </div>
        )}
        <Navbar.Toggle showIn="sm" aria-label="toggle navigation" />
      </Navbar.Content>
      <Navbar.Collapse>
        {navbarOptions.map(
          (option, index) =>
            userE?.email &&
            option.role.includes(userE.role) && (
              <Navbar.CollapseItem key={option.label}>
                <Link style={{ color: "red" }} to={`${option.path}`}>
                  {option.label}
                </Link>
              </Navbar.CollapseItem>
            )
        )}
        {!userE?.email && (
          <>
            {path != "register" && (
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registrarse
                </Link>
              </li>
            )}
            {path != "login" && (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </>
        )}
        <Navbar.CollapseItem>
          <Link style={{ color: "red" }} to="/">
            Inicio
          </Link>
        </Navbar.CollapseItem>
        {userE?.email && (
          <div>
            <hr className="mb-2" />
            <button
              className="btn btn-outline-danger d-md-block"
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut /> Log out
            </button>
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
