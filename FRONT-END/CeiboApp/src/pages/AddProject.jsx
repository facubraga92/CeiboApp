import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { message } from "antd";
import Layout from "../components/layouts/Layout";
import { getUserByToken, useCredentials } from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [membersList, setMembersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [inputs, setInputs] = useState({});
  const [created_by, setCreated_by] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const handle = () => {
      const user = getUserByToken();
      setCreated_by(user);
    };

    axios
      .get("http://localhost:3000/api/users/admin/members", useCredentials)
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
      .get("http://localhost:3000/api/customers/all", useCredentials)
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
  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/projects/create", inputs, useCredentials)
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
    if (value === "" || !value || value.length == 0) {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputs((values) => ({ ...values, [name]: value }));
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
      <div className="container col-12 col-md-6 mt-2 pb-5">
        <h2 className="text-center">Crear Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              required
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              rows="4"
              name="description"
              value={inputs.description || ""}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Código</label>
            <input
              type="text"
              className="form-control"
              required
              name="code"
              value={inputs.code || ""}
              onChange={handleChange}
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
