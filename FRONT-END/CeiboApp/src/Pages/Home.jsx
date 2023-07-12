import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, userInitialState } from "../state/user";

const Home = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    axios
      .post("http://localhost:3000/api/users/logout", null, {
        withCredentials: true,
        credentials: "include",
      })
      .then((user) => {
        dispatch(setUser(userInitialState));
      });
  };

  return (
    <div>
      <h2>Hola, estás en una ruta privada</h2>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
