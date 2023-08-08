import React, { useEffect, useState } from "react";

import axios from "axios";

import { FileSearchOutlined } from "@ant-design/icons";
import { message, Modal, Button, Input, Space } from "antd";

import Layout from "../components/layouts/Layout";
import { useCredentials } from "../utils/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    address: "",
    contactInfo: "",
  });

  const [searchText, setSearchText] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/customers/all", useCredentials)
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:3000/api/projects/getAll", useCredentials)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = customers.filter((customer) => {
      const isNameMatch =
        customer.name &&
        customer.name.toLowerCase().includes(value.toLowerCase());
      const isAddressMatch =
        customer.address &&
        customer.address.toLowerCase().includes(value.toLowerCase());
      const isContactInfoMatch =
        customer.contactInfo &&
        customer.contactInfo.toLowerCase().includes(value.toLowerCase());

      return isNameMatch || isAddressMatch || isContactInfoMatch;
    });

    setFilteredCustomers(filtered);
  };

  const handleDeleteClick = (customerId) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este cliente?");

    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/customers/${customerId}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          message.success(response.data.message);
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer._id !== customerId)
          );
          axios
            .get("http://localhost:3000/api/customers/all")
            .then((response) => {
              setCustomers(response.data);
              setFilteredCustomers(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const startEditing = (customerId) => {
    const customerToEdit = customers.find(
      (customer) => customer._id === customerId
    );
    setEditingCustomer(customerToEdit);
  };

  const saveChanges = (customerId) => {
    const updatedCustomers = customers.map((customer) => {
      if (customer._id === customerId) {
        return editingCustomer;
      }
      return customer;
    });

    axios
      .put(
        `http://localhost:3000/api/customers/${customerId}`,
        editingCustomer,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        message.success(response.data.message);
        setCustomers(updatedCustomers);
        setEditingCustomer(null);
        axios
          .get("http://localhost:3000/api/customers/all")
          .then((response) => {
            setCustomers(response.data);
            setFilteredCustomers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelEditing = () => {
    setEditingCustomer(null);
  };

  const openCreateModal = () => {
    setCreateModalVisible(true);
  };

  const openProjectModal = (projectIds) => {
    setSelectedProject(projectIds);
    setProjectModalVisible(true);
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleCreateCustomer = () => {
    axios
      .post("http://localhost:3000/api/customers/create", newCustomer, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        message.success(response.data);
        setCreateModalVisible(false);
        setNewCustomer({
          name: "",
          address: "",
          contactInfo: "",
        });
        axios
          .get("http://localhost:3000/api/customers/all")
          .then((response) => {
            setCustomers(response.data);
            setFilteredCustomers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssociatedProjects = (customer) => {
    return (
      <Button
        type="link"
        onClick={() => openProjectModal(customer.associatedProjects)}
      >
        <FileSearchOutlined style={{ color: "red", fontSize: "24px" }} />
      </Button>
    );
  };

  return (
    <Layout title="Clientes">
      <div className="p-4">
        <div
          className="card"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="card-body d-flex flex-column align-items-center">
            <div className="col">
              <h2 className="text-center display-4">Clientes</h2>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container">
                <div className="d-inline-flex" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Space wrap>
                        <Button type="primary" danger onClick={openCreateModal}>
                          Crear Cliente
                        </Button>
                      </Space>
                    </li>
                  </ul>
                  <form className="d-flex align-items-center">
                    <Input
                      size="large"
                      type="search"
                      placeholder="Buscar Cliente..."
                      aria-label="Search"
                      value={searchText}
                      onChange={handleSearch}
                    />
                  </form>
                </div>
              </div>
            </nav>

            <div className="table-responsive table-responsive-sm">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th className="d-none d-sm-table-cell">
                      Información de contacto
                    </th>
                    <th className="text-center">Proyectos asociados</th>
                    <th>Editar</th>
                    <th>Borrar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        {editingCustomer &&
                        editingCustomer._id === customer._id ? (
                          <Input
                            size="large"
                            type="text"
                            value={editingCustomer.name}
                            onChange={(e) =>
                              setEditingCustomer((prevCustomer) => ({
                                ...prevCustomer,
                                name: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          customer.name
                        )}
                      </td>
                      <td>
                        {editingCustomer &&
                        editingCustomer._id === customer._id ? (
                          <Input
                            size="large"
                            type="text"
                            value={editingCustomer.address}
                            onChange={(e) =>
                              setEditingCustomer((prevCustomer) => ({
                                ...prevCustomer,
                                address: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          customer.address
                        )}
                      </td>
                      <td className="d-none d-sm-table-cell">
                        {editingCustomer &&
                        editingCustomer._id === customer._id ? (
                          <Input
                            size="large"
                            type="text"
                            value={editingCustomer.contactInfo}
                            onChange={(e) =>
                              setEditingCustomer((prevCustomer) => ({
                                ...prevCustomer,
                                contactInfo: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          customer.contactInfo
                        )}
                      </td>
                      <td className="text-center">
                        {getAssociatedProjects(customer)}
                      </td>
                      <td>
                        {editingCustomer &&
                        editingCustomer._id === customer._id ? (
                          <>
                            <div className="d-flex flex-column flex-sm-row">
                              <div className="mb-2 mb-sm-0">
                                <button
                                  className="btn btn-danger mr-2"
                                  onClick={() => saveChanges(customer._id)}
                                >
                                  Guardar
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={cancelEditing}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => startEditing(customer._id)}
                          >
                            Editar
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteClick(customer._id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Modal
              title="Crear Cliente"
              open={createModalVisible}
              onCancel={() => setCreateModalVisible(false)}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setCreateModalVisible(false)}
                >
                  Cancelar
                </Button>,
                <Button type="primary" danger 
                  key="create"
                  onClick={handleCreateCustomer}
                >
                  Crear
                </Button>,
              ]}
            >
              <div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleNewCustomerChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={newCustomer.address}
                    onChange={handleNewCustomerChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Información de contacto</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactInfo"
                    value={newCustomer.contactInfo}
                    onChange={handleNewCustomerChange}
                  />
                </div>
              </div>
            </Modal>
            <Modal
              title="Proyectos asociados al cliente:"
              open={projectModalVisible}
              onCancel={() => setProjectModalVisible(false)}
              footer={null}
              bodyStyle={{ height: "400px", overflowY: "auto" }}
            >
              {selectedProject && selectedProject.length > 0 ? (
                <ul>
                  {selectedProject.map((project) => {
                    return <li key={project._id}>{project.name}</li>;
                  })}
                </ul>
              ) : (
                <p>No hay proyectos asociados.</p>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
