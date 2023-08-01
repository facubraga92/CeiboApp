import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Button } from "antd";
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
        📋
      </Button>
    );
  };

  return (
    <Layout title="Clientes">
      <div>
        <div className="col">
          <h2 className="text-center display-4">Clientes</h2>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            {/* <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}

            <div className="d-inline-flex" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Button type="primary" onClick={openCreateModal}>
                    Crear Cliente
                  </Button>
                </li>
              </ul>
              <form className="d-flex align-items-center">
                <input
                  className="form-control me-2"
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

        <div className="table-responsive">
          <table style={{ maxWidth: "100%" }} className="table table-striped">
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
                    {editingCustomer && editingCustomer._id === customer._id ? (
                      <input
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
                    {editingCustomer && editingCustomer._id === customer._id ? (
                      <input
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
                    {editingCustomer && editingCustomer._id === customer._id ? (
                      <input
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
                    {editingCustomer && editingCustomer._id === customer._id ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => saveChanges(customer._id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={cancelEditing}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
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
            <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
              Cancelar
            </Button>,
            <Button key="create" type="primary" onClick={handleCreateCustomer}>
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
        >
          {selectedProject && (
            <ul>
              {selectedProject.map((projectId) => {
                const project = projects.find((p) => p._id === projectId);
                return <li key={projectId}>{project && project.name}</li>;
              })}
            </ul>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Customers;