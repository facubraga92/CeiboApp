import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import axios from "axios";
import { Button } from "@nextui-org/react";
import { Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";

import Layout from "../components/layouts/Layout";
import { getUserByToken, useCredentials } from "../utils/api";
import { envs } from "../config/env/env.config";

const ProjectForm = () => {
  const [membersList, setMembersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [inputs, setInputs] = useState({});
  const [created_by, setCreated_by] = useState({});

  const { VITE_BACKEND_URL } = envs;

  const navigate = useNavigate();
  useEffect(() => {
    const handle = () => {
      const user = getUserByToken();
      setCreated_by(user);
    };

    axios
      .get(`${VITE_BACKEND_URL}/users/admin/members`, useCredentials)
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
      .get(`${VITE_BACKEND_URL}/customers/all`, useCredentials)
      .then((response) => {
        const sortedCustomers = response.data.sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          }
          return 0;
        });
        setCustomersList(sortedCustomers);
      });

    handle();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${VITE_BACKEND_URL}/projects/create`, inputs, useCredentials)
      .then((response) => {
        console.log(inputs);
        message.success(`Proyecto ${inputs.name} creado!`);
        // Restablecer los campos del formulario
        setInputs({});
        navigate("/Projects");
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

  const handleChange = (event) => {
    setInputs({ ...inputs, created_by: created_by.id });
    const { name, value } = event.target;

    // Convertir la primera letra a mayúscula si está en minúscula
    const capitalizedValue =
      value && typeof value === "string"
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;

    if (
      capitalizedValue === "" ||
      !capitalizedValue ||
      capitalizedValue.length === 0
    ) {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputs((values) => ({ ...values, [name]: capitalizedValue }));
    }
    return;
  };

  const handleChangeSelect = (name, value) => {
    let valor = value?.value?._id;
    if (!valor) {
      valor = value.map((e) => e.value._id);
    }
    const res = { target: { name: name, value: valor } };
    handleChange(res);
  };

  return (
    <Layout title="AddProject">
      <div className="p-4">
        <div
          className="card"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="container col-12 col-md-6 mt-2 pb-5">
            <h2 className="text-center">Crear Proyecto</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <Input
                  type="text"
                  required
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  minLength={1}
                  maxLength={40}
                  showCount
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <TextArea
                  rows="4"
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleChange}
                  minLength={1}
                  maxLength={1000}
                  showCount
                  style={{ resize: "none" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Código</label>
                <Input
                  type="text"
                  required
                  name="code"
                  value={inputs.code || ""}
                  onChange={handleChange}
                  minLength={1}
                  maxLength={20}
                  showCount
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cliente</label>
                <Select
                  required
                  options={customerOptions}
                  onChange={(value) => handleChangeSelect("customer", value)}
                  name="customer"
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
                  name="consultors"
                  onChange={(value) => handleChangeSelect("consultors", value)}
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
                  name="managers"
                  onChange={(value) => handleChangeSelect("managers", value)}
                  placeholder="Seleccionar managers..."
                />
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  type="submit"
                  color="danger"
                  variant="shadow"
                  colorVariant="danger"
                >
                  Crear proyecto
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectForm;
