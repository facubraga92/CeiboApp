import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { message } from "antd";
import Layout from "../components/layouts/Layout";

const Members = () => {
  const user = useSelector((state) => state.user);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/admin/members", {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        const sortedUsers = response.data.sort((a, b) => {
          if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          return 0;
        });
        setMembers(sortedUsers);
        setFilteredMembers(sortedUsers);
      });
  }, []);

  const handleConsultoresFilter = () => {
    const consultores = members.filter(
      (member) =>
        member.role === "consultor" &&
        (member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          member.email.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredMembers(consultores);
  };

  const handleManagersFilter = () => {
    const managers = members.filter(
      (member) =>
        member.role === "manager" &&
        (member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          member.email.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredMembers(managers);
  };

  const handleSociosFilter = () => {
    const socios = members.filter(
      (member) =>
        member.role === "socio" &&
        (member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          member.email.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredMembers(socios);
  };

  const handleTodosFilter = () => {
    setFilteredMembers(members);
    setSearchText("");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = members.filter(
      (member) =>
        (member.name &&
          member.name.toLowerCase().includes(value.toLowerCase())) ||
        (member.lastName &&
          member.lastName.toLowerCase().includes(value.toLowerCase())) ||
        (member.email &&
          member.email.toLowerCase().includes(value.toLowerCase()))
    );

    setFilteredMembers(filtered);
  };

  const handleCheckboxChange = (e) => {
    const memberId = e.target.value;
    const isChecked = e.target.checked;

    if (user.id !== memberId) {
      axios
        .get(`http://localhost:3000/api/users/admin/members/${memberId}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        })
        .then(() => {
          // Actualizar el estado local solo si la solicitud es exitosa
          setMembers((prevMembers) =>
            prevMembers.map((member) => {
              if (member._id === memberId) {
                return {
                  ...member,
                  role: isChecked ? "manager" : "consultor",
                };
              }
              return member;
            })
          );

          setFilteredMembers((prevFilteredMembers) =>
            prevFilteredMembers.map((member) => {
              if (member._id === memberId) {
                return {
                  ...member,
                  role: isChecked ? "manager" : "consultor",
                };
              }
              return member;
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      message.error(
        "No puedes quitarte los privilegios de administrador a ti mismo."
      );
    }
  };

  const handleDeleteClick = (memberId) => {
    if (user.id === memberId) {
      message.error("No puedes eliminarte a ti mismo.");
      return;
    }

    const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");

    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/users/admin/members/${memberId}`, {
          withCredentials: true,
          credentials: "include",
        })
        .then(() => {
          // Eliminar el usuario de los estados locales
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member._id !== memberId)
          );
          setFilteredMembers((prevFilteredMembers) =>
            prevFilteredMembers.filter((member) => member._id !== memberId)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Layout title="Members">
      <div>
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a
              className="nav-link active"
              aria-current="page"
              onClick={handleConsultoresFilter}
            >
              Consultores
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={handleManagersFilter}>
              Managers
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={handleSociosFilter}>
              Socios
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={handleTodosFilter}>
              Todos
            </a>
          </li>
        </ul>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar miembro..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>
                  <div className="form-check">
                    <label className="form-check-label">Manager</label>
                  </div>
                </th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>
                    {member.role === "consultor" ||
                    member.role === "manager" ? (
                      <div className="form-check d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={member._id}
                          onChange={handleCheckboxChange}
                          checked={member.role === "manager"}
                        />
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(member._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Members;
