import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { message, Select } from "antd";
import Layout from "../components/layouts/Layout";

const { Option } = Select;

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

  useEffect(() => {
    if (searchText === "" || searchText === "Todo")
      return setFilteredMembers(members);
    const filteredMembers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.email.toLowerCase().includes(searchText.toLowerCase()) ||
        member.role.toLowerCase().includes(searchText.toLowerCase())
    );
    return setFilteredMembers(filteredMembers);
  }, [searchText]);

  const handleFilterByAny = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const handleRoleChange = (memberId, selectedRole) => {
    axios
      .put(
        `http://localhost:3000/api/users/admin/members/${memberId}`,
        { role: selectedRole },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        }
      )
      .then(() => {
        // Actualizar el estado local solo si la solicitud es exitosa
        setMembers((prevMembers) =>
          prevMembers.map((member) => {
            if (member._id === memberId) {
              return { ...member, role: selectedRole };
            }
            return member;
          })
        );

        setFilteredMembers((prevFilteredMembers) =>
          prevFilteredMembers.map((member) => {
            if (member._id === memberId) {
              return { ...member, role: selectedRole };
            }
            return member;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
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
    <Layout title={"Miembros"}>
      <div className="container col-sm-12 col-md-11">
        <div className="row justify-content-center mt-3 mb-3">
          <div className="col-sm-2">
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Consultor"
              name="consultor"
              onClick={handleFilterByAny}
            />
          </div>
          <div className="col-sm-2">
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Socio"
              name="socio"
              onClick={handleFilterByAny}
            />
          </div>
          <div className="col-sm-2">
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Manager"
              name="manager"
              onClick={handleFilterByAny}
            />
          </div>
          <div className="col-sm-2">
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Todo"
              name="todo"
              onClick={handleFilterByAny}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar miembro..."
              value={searchText || ""}
              onChange={handleFilterByAny}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="d-none d-md-table-cell">Nombre</th>
                  <th className="d-none d-md-table-cell">Apellido</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id}>
                    <td className="d-none d-md-table-cell">{member.name}</td>
                    <td className="d-none d-md-table-cell">
                      {member.lastName}
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <Select
                        onClick={() =>
                          user.id == member._id
                            ? message.warning(
                                "No puedes quitarte el rol de Admin a ti mismo."
                              )
                            : ""
                        }
                        defaultValue={member.role}
                        style={{ width: 120 }}
                        disabled={user.id == member._id}
                        onChange={(value) =>
                          handleRoleChange(member._id, value)
                        }
                      >
                        <Option value="admin">Admin</Option>
                        <Option value="manager">Manager</Option>
                        <Option value="socio">Socio</Option>
                        <Option value="consultor">Consultor</Option>
                      </Select>
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
      </div>
    </Layout>
  );
};

export default Members;
