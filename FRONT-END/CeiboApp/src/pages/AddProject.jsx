import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import Layout from "../components/layouts/Layout";

const ProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [consultors, setConsultors] = useState([]);
  const [managers, setManagers] = useState([]);
  const [partners, setPartners] = useState([]);

  const handleCustomerChange = (selectedOption) => {
    setCustomer(selectedOption);
  };

  const handleConsultorChange = (selectedOptions) => {
    setConsultors(selectedOptions);
  };

  const handleManagerChange = (selectedOptions) => {
    setManagers(selectedOptions);
  };

  const handlePartnerChange = (selectedOptions) => {
    setPartners(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el objeto de proyecto
    const project = {
      name,
      description,
      customer,
      consultors,
      managers,
      partners,
    };

    // Simular la solicitud POST al endpoint
    axios
      .post("http://localhost:3000/api/projects/create", project)
      .then((response) => {
        // Manejar la respuesta del servidor
        console.log(response.data);
        // Restablecer los campos del formulario
        setName("");
        setDescription("");
        setCustomer("");
        setConsultors([]);
        setManagers([]);
        setPartners([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const customerOptions = [
    { value: "1", label: "Cliente 1" },
    { value: "2", label: "Cliente 2" },
    { value: "3", label: "Cliente 3" },
  ];

  const userOptions = [
    { value: "1", label: "Consultor 1" },
    { value: "2", label: "Consultor 2" },
    { value: "3", label: "Consultor 3" },
    { value: "4", label: "Manager 1" },
    { value: "5", label: "Manager 2" },
    { value: "6", label: "Manager 3" },
    { value: "7", label: "Socio 1" },
    { value: "8", label: "Socio 2" },
    { value: "9", label: "Socio 3" },
  ];

  return (
    <Layout title="AddProject">
      <div className="container">
        <h2>Crear Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
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
            <label className="form-label">Cliente</label>
            <Select
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
                option.label.includes("Consultor")
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
                option.label.includes("Manager")
              )}
              isMulti
              value={managers}
              onChange={handleManagerChange}
              placeholder="Seleccionar managers..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Socios</label>
            <Select
              options={userOptions.filter((option) =>
                option.label.includes("Socio")
              )}
              isMulti
              value={partners}
              onChange={handlePartnerChange}
              placeholder="Seleccionar socios..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Proyecto
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProjectForm;
