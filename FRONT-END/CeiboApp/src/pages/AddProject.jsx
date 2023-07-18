import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { message } from "antd";
import Layout from "../components/layouts/Layout";

const ProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [customer, setCustomer] = useState("");
  const [consultors, setConsultors] = useState([]);
  const [managers, setManagers] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/admin/members", {
        headers: { "Content-Type": "application/json" },
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
        setMembersList(sortedUsers);
      });

    axios
      .get("http://localhost:3000/api/customers/all", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        const sortedCustomers = response.data.sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          }
          return 0;
        });
        setCustomersList(sortedCustomers);
      });
  }, []);

  const handleCustomerChange = (selectedOption) => {
    setCustomer(selectedOption);
  };

  const handleConsultorChange = (selectedOptions) => {
    setConsultors(selectedOptions);
  };

  const handleManagerChange = (selectedOptions) => {
    setManagers(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el objeto de proyecto
    const project = {
      name,
      description,
      code,
      customer: customer.value._id,
      consultors: consultors.map((consultor) => consultor.value._id),
      managers: managers.map((manager) => manager.value._id),
    };
    axios
      .post("http://localhost:3000/api/projects/create", project, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        // Manejar la respuesta del servidor
        message.success(response.data);
        // Restablecer los campos del formulario
        setName("");
        setDescription("");
        setCode("");
        setCustomer("");
        setConsultors([]);
        setManagers([]);
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const customerOptions = customersList.map((customer) => {
    return {
      value: customer,
      label: `${customer.name}`,
    };
  });

  const userOptions = membersList.map((member) => {
    return { value: member, label: `${member.name} ${member.lastName}` };
  });

  return (
    <Layout title={"Agregar proyecto"}>
      <div className="container">
        <h2>Crear Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Código</label>
            <input
              type="text"
              className="form-control"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cliente</label>
            <Select
              required
              options={customerOptions}
              value={customer}
              onChange={handleCustomerChange}
              isClearable
              placeholder="Seleccionar cliente..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Consultores</label>
            <Select
              options={userOptions.filter((option) =>
                option.value.role.includes("consultor")
              )}
              isMulti
              value={consultors}
              onChange={handleConsultorChange}
              placeholder="Seleccionar consultores..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Managers</label>
            <Select
              options={userOptions.filter((option) =>
                option.value.role.includes("manager")
              )}
              isMulti
              value={managers}
              onChange={handleManagerChange}
              placeholder="Seleccionar managers..."
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value={"Crear proyecto"}
          />
        </form>
      </div>
    </Layout>
  );
};

export default ProjectForm;
