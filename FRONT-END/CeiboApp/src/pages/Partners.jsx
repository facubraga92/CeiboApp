import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Spin, message } from "antd";
import Select from "react-select";
import Layout from "../components/layouts/Layout";
import { useCredentials } from "../utils/api";
import { envs } from "../config/env/env.config";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Nuevo estado

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}/users/admin/socio`, useCredentials)
      .then((response) => {
        const sortedUsers = response.data.sort((a, b) => {
          if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          return 0;
        });
        const sortedPartners = sortedUsers.filter(
          (user) => user.role === "socio"
        );
        setPartners(sortedPartners);
        setFilteredPartners(sortedPartners);
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
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = partners.filter((partner) => {
      const isNameMatch =
        partner.name &&
        partner.name.toLowerCase().includes(value.toLowerCase());
      const isLastNameMatch =
        partner.lastName &&
        partner.lastName.toLowerCase().includes(value.toLowerCase());
      const isEmailMatch =
        partner.email &&
        partner.email.toLowerCase().includes(value.toLowerCase());
      const isCustomerMatch =
        partner.associatedCustomers &&
        partner.associatedCustomers.some((customerId) => {
          const customer = customersList.find(
            (customer) => customer._id === customerId
          );
          return (
            customer &&
            customer.name.toLowerCase().includes(value.toLowerCase())
          );
        });

      return isNameMatch || isLastNameMatch || isEmailMatch || isCustomerMatch;
    });

    setFilteredPartners(filtered);
  };

  const customerOptions = customersList.map((customer) => {
    return {
      value: customer._id,
      label: customer.name,
    };
  });

  const handleUpdateClick = (partnerId) => {
    const updatedPartner = {
      associatedCustomers: selectedCustomer
        ? selectedCustomer.value.map((customer) => customer.value)
        : null,
    };

    axios
      .put(
        `${VITE_BACKEND_URL}/users/admin/members/${partnerId}`,
        updatedPartner,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then(() => {
        // Actualizar el socio en los estados locales
        setPartners((prevPartners) =>
          prevPartners.map((partner) => {
            if (partner._id === partnerId) {
              return {
                ...partner,
                associatedCustomers: updatedPartner.associatedCustomers,
              };
            }
            return partner;
          })
        );
        setFilteredPartners((prevFilteredPartners) =>
          prevFilteredPartners.map((partner) => {
            if (partner._id === partnerId) {
              return {
                ...partner,
                associatedCustomers: updatedPartner.associatedCustomers,
              };
            }
            return partner;
          })
        );

        message.success("Cliente asociado actualizado con éxito.");
      })
      .catch((error) => {
        console.error(error);
        message.error("Error al actualizar el cliente asociado.");
      });
  };

  return (
    <Layout>
      <div className="container col-12 col-md-10 d-flex flex-column align-items-center">
        <div className="mt-2 mb-2" style={{ maxWidth: "20rem" }}>
          <Input
            size="large"
            type="text"
            placeholder="Buscar miembro..."
            value={searchText}
            onChange={handleSearch}
            allowClear
            autoSize
          />
        </div>
        <div className="">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell">Nombre</th>
                <th className="d-none d-md-table-cell">Apellido</th>
                <th>Email</th>
                <th>Cliente Asignado</th>
                <th>Lista de Clientes</th>
                <th></th>
              </tr>
            </thead>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <tbody>
                  <tr key={partner._id}>
                    <td className="d-none d-md-table-cell">{partner.name}</td>
                    <td className="d-none d-md-table-cell">
                      {partner.lastName}
                    </td>
                    <td>{partner.email}</td>
                    <td>
                      {partner.associatedCustomers &&
                      partner.associatedCustomers.length > 0
                        ? partner.associatedCustomers.map((customerId) => {
                            const customer = customersList.find(
                              (customer) => customer._id === customerId
                            );
                            return customer ? ` "${customer.name}"; ` : "";
                          })
                        : ""}
                    </td>
                    <td>
                      <Select
                        options={customerOptions}
                        value={
                          partner._id === selectedCustomer?.partnerId
                            ? selectedCustomer.value
                            : null
                        }
                        onChange={(selectedOption) =>
                          setSelectedCustomer({
                            partnerId: partner._id,
                            value: selectedOption,
                          })
                        }
                        isClearable={true}
                        isMulti={true}
                        placeholder="Selecciona un Cliente"
                      />
                    </td>
                    <td>
                      {partner._id == selectedCustomer?.partnerId &&
                      selectedCustomer?.value?.value == "" ? (
                        <button
                          title="Quitar Cliente al Usuario Seleccionado"
                          className="btn btn-danger"
                          onClick={() => handleUpdateClick(partner._id)}
                        >
                          Quitar Cliente
                        </button>
                      ) : (
                        <button
                          title="Asignar Cliente al Usuario Seleccionado"
                          className="btn btn-warning"
                          onClick={() => handleUpdateClick(partner._id)}
                        >
                          Asignar Cliente
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center">
                    <Spin size="large" />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
