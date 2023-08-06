import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import { Button, Modal } from "react-bootstrap";
import { message, Select } from "antd";
import { Input } from "@nextui-org/react";
import { FiUserX } from "react-icons/fi";

import Layout from "../components/layouts/Layout";import { toast } from "react-toastify";
import { toastSuccess } from "../utils/api";
import { envs } from "../config/env/env.config";

const { Option } = Select;

const Members = () => {
  const user = useSelector((state) => state.user);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}/users/admin/members`, {
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
        (member.name &&
          member.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (member.lastName &&
          member.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
        (member.email &&
          member.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (member.role &&
          member.role.toLowerCase().includes(searchText.toLowerCase()))
    );

    return setFilteredMembers(filteredMembers);
  }, [searchText]);

  const handleFilterByAny = (e) => {
    const { value } = e.target;
    if (value == searchText) {
      setSearchText("");
    } else {
      setSearchText(value);
    }
    if (value == "") return setRoleSearch("");
  };

  const handleRoleChange = (memberId, selectedRole) => {
    axios
      .put(
        `${VITE_BACKEND_URL}/users/admin/members/${memberId}`,
        { role: selectedRole },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        }
      )
      .then(() => {
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

        handleToast();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    handleModalToggle();
    axios
      .delete(`${VITE_BACKEND_URL}/users/admin/members/${idDelete}`, {
        withCredentials: true,
        credentials: "include",
      })
      .then(() => {
        toastSuccess("Usuario eliminado!");
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member._id !== idDelete)
        );
        setFilteredMembers((prevFilteredMembers) =>
          prevFilteredMembers.filter((member) => member._id !== idDelete)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModal = (memberId) => {
    if (user.id === memberId) {
      message.error("No puedes eliminarte a ti mismo.");
      return;
    } else {
      setIdDelete(memberId);
      handleModalToggle();
    }
  };

  const handleModalToggle = () => {
    return setShowModal(!showModal);
  };

  const handleSelectSearch = (e) => {
    setRoleSearch(e);
    setSearchText(e);
  };

  const handleToast = () => {
    toast.success("Cambios aceptados", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    return;
  };

  return (
    <Layout title={"Usuarios"}>
      <div className="p-4">
        <div
          className="card"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="container col-sm-12 col-md-11">
            <div className="text-center mt-1">
              <h2 className="display-4">Administrador de usuarios</h2>
            </div>
            <div className="row mt-4 justify-content-center">
              <div className="input-group mb-3  col-11 col-md-6">
                <Input
                  underlined
                  labelPlaceholder="Buscar usuario"
                  clearable={true}
                  color="error"
                  fullWidth={true}
                  value={searchText || ""}
                  onChange={handleFilterByAny}
                />
              </div>
            </div>
            <div className="row justify-content-sm-center mb-3 d-none d-md-flex">
              <div className="col-6 col-md-2">
                <input
                  type="button"
                  className="btn btn-outline-danger btn-block"
                  value="Consultor"
                  name="consultor"
                  onClick={handleFilterByAny}
                />
              </div>
              <div className="col-6 col-md-2">
                <input
                  type="button"
                  className="btn btn-outline-danger btn-block"
                  value="Socio"
                  name="socio"
                  onClick={handleFilterByAny}
                />
              </div>
              <div className="col-6 col-md-2">
                <input
                  type="button"
                  className="btn btn-outline-danger btn-block"
                  value="Manager"
                  name="manager"
                  onClick={handleFilterByAny}
                />
              </div>
            </div>
            <div className="row justify-content-center mb-3 d-md-none ">
              <div>
                <Select
                  style={{ width: 130 }}
                  onChange={handleSelectSearch}
                  value={roleSearch || "Filtrar por Rol"}
                >
                  <Option value="Consultor">Consultor</Option>
                  <Option value="Socio">Socio</Option>
                  <Option value="Manager">Manager</Option>
                </Select>
              </div>
            </div>
            <div className="row">
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
                        <td className="d-none d-md-table-cell">
                          {member.name}
                        </td>
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
                        <td
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleModal(member._id)}
                            title="Eliminar usuario"
                          >
                            <FiUserX size={30} fill="currentColor" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} centered onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estas seguro de eliminar?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se eliminara el usuario seleccionado</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleModalToggle}>
            Volver
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Members;
