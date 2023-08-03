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
  const [selectedCustomer, setSelectedCustomer] = useState({});

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

  useEffect(() => {
    // Cargar las selecciones previas del almacenamiento local al estado selectedCustomer
    const savedSelectedCustomers = localStorage.getItem("selectedCustomers");
    if (savedSelectedCustomers) {
      setSelectedCustomer(JSON.parse(savedSelectedCustomers));
    } else {
      setSelectedCustomer({});
    }
  }, []);

  useEffect(() => {
    // Actualizar el almacenamiento local cuando cambia el estado selectedCustomer
    localStorage.setItem("selectedCustomers", JSON.stringify(selectedCustomer));
  }, [selectedCustomer]);

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

  const handleUpdatePartner = (partnerId, updatedPartner) => {
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
        setPartners((prevPartners) =>
          prevPartners.map((prevPartner) => {
            if (prevPartner._id === partnerId) {
              return {
                ...prevPartner,
                associatedCustomers: updatedPartner.associatedCustomers,
              };
            }
            return prevPartner;
          })
        );
        setFilteredPartners((prevFilteredPartners) =>
          prevFilteredPartners.map((prevFilteredPartner) => {
            if (prevFilteredPartner._id === partnerId) {
              return {
                ...prevFilteredPartner,
                associatedCustomers: updatedPartner.associatedCustomers,
              };
            }
            return prevFilteredPartner;
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
    <Layout title="Socios">
      <div className="p-4">
        <div
          className="card"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="card-body d-flex flex-column align-items-center">
            <div className="container col-12 col-md-10 d-flex flex-column align-items-center">
              <div className="col">
                <h2 className="text-center display-4">Socios</h2>
              </div>
              <div
                className="mt-2 mb-2 col-11 col-md-6"
                style={{ maxWidth: "20rem" }}
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Buscar miembro..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="d-none d-md-table-cell">Nombre</th>
                      <th className="d-none d-md-table-cell">Apellido</th>
                      <th>Email</th>
                      <th>Clientes asociados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPartners.length > 0 ? (
                      filteredPartners.map((partner) => (
                        <tr key={partner._id}>
                          <td className="d-none d-md-table-cell">
                            {partner.name}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {partner.lastName}
                          </td>
                          <td>{partner.email}</td>
                          <td>
                            <Select
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: state.isFocused ? "grey" : "red",
                                }),
                              }}
                              options={customerOptions}
                              value={selectedCustomer[partner._id] || null}
                              onChange={(selectedOption) => {
                                setSelectedCustomer((prevSelectedCustomer) => ({
                                  ...prevSelectedCustomer,
                                  [partner._id]: selectedOption,
                                }));

                                const updatedPartner = {
                                  associatedCustomers: selectedOption
                                    ? selectedOption.map(
                                        (customer) => customer.value
                                      )
                                    : null,
                                };

                                handleUpdatePartner(
                                  partner._id,
                                  updatedPartner
                                );
                              }}
                              isClearable={true}
                              isMulti={true}
                              placeholder="Selecciona un Cliente"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <Spin size="large" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
