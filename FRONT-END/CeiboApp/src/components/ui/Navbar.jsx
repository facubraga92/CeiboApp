import { Navbar } from "@nextui-org/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, userInitialState } from "../../state/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserByToken, userMe } from "../../utils/api";
import { envs } from "../../config/env/env.config";

export default function NavBar() {
  const [userE, setUsere] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { VITE_BACKEND_URL } = envs;

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
    { label: "Ver Novedades", path: "/home", role: ["socio"] },
    { label: "Clientes", path: "/customers", role:"manager" }
  ];

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <img src="/ceibo-red.png" style={{ height: "45px" }} alt="" />
      </Navbar.Brand>
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        {navbarOptions.map(
          (option, index) =>
            userE?.email &&
            option.role.includes(userE.role) && (
              <Navbar.Item key={option.label}>
                <Link
                  color="inherit"
                  css={{
                    minWidth: "100%",
                  }}
                  to={`${option.path}`}
                >
                  {option.label}
                </Link>
              </Navbar.Item>
            )
        )}
      </Navbar.Content>
      <Navbar.Content className="mx-4">
        {!userE?.email && (
          <>
            <Link to="/login">
              <Navbar.Item color="inherit" className="d-none d-md-block">
                <button type="button" class="btn btn-outline-danger">
                  Iniciar sesión
                </button>
              </Navbar.Item>
            </Link>
            <Link to="/register">
              <Navbar.Item className="d-none d-md-block">
                <button type="button" class="btn btn-outline-danger">
                  Registrarse
                </button>
              </Navbar.Item>
            </Link>
          </>
        )}
        {userE?.email && (
          <button
            className="btn btn-danger d-none d-md-block"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
        <Navbar.Toggle showIn="sm" aria-label="toggle navigation" />
      </Navbar.Content>
      <Navbar.Collapse>
        {navbarOptions.map(
          (option, index) =>
            userE?.email &&
            option.role.includes(userE.role) && (
              <Navbar.CollapseItem key={option.label}>
                <Link
                  color="inherit"
                  css={{
                    minWidth: "100%",
                  }}
                  to={`${option.path}`}
                >
                  {option.label}
                </Link>
              </Navbar.CollapseItem>
            )
        )}
        {!userE?.email && (
          <>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Registrarse
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Iniciar sesión
              </Link>
            </li>
          </>
        )}
        {userE?.email && (
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
