import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { message } from "antd";
import Select from "react-select";

const Partners = () => {
  const user = useSelector((state) => state.user);
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [customersList, setCustomersList] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Nuevo estado

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
        const sortedPartners = sortedUsers.filter(
          (user) => user.role === "socio"
        );
        setPartners(sortedPartners);
        setFilteredPartners(sortedPartners);
      });
    axios
      .get("http://localhost:3000/api/customers/all", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        const sortedCustomers = response.data.sort((a, b) => {
          if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          return 0;
        });
        setCustomersList(sortedCustomers);
      });
  }, []);

  const handleCustomerChange = (selectedOption) => {
    setCustomer(selectedOption);
  };

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
        partner.associatedCustomer &&
        customersList.some(
          (customer) =>
            customer._id === partner.associatedCustomer &&
            customer.name.toLowerCase().includes(value.toLowerCase())
        );

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
      associatedCustomer: selectedCustomer
        ? selectedCustomer?.value?.value
        : null,
    };

    axios
      .put(
        `http://localhost:3000/api/users/admin/members/${partnerId}`,
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
                associatedCustomer: updatedPartner.associatedCustomer,
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
                associatedCustomer: updatedPartner.associatedCustomer,
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

    // No es necesario restablecer el estado de selectedCustomer aquí
  };

  const handleDeleteClick = (partnerId) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");

    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/users/admin/members/${partnerId}`, {
          withCredentials: true,
          credentials: "include",
        })
        .then(() => {
          // Eliminar el usuario de los estados locales
          setPartners((prevPartners) =>
            prevPartners.filter((partner) => partner._id !== partnerId)
          );
          setFilteredPartners((prevFilteredPartners) =>
            prevFilteredPartners.filter((partner) => partner._id !== partnerId)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar miembro..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Cliente Asignado</th>
              <th>Lista de Clientes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner._id}>
                <td>{partner.name}</td>
                <td>{partner.lastName}</td>
                <td>{partner.email}</td>
                <td>
                  {partner.associatedCustomer
                    ? customersList.find(
                        (customer) =>
                          customer._id === partner.associatedCustomer
                      )?.name || ""
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
                    placeholder="Selecciona un Cliente"
                  />
                </td>
                <td>
                  {partner._id == selectedCustomer?.partnerId &&
                  selectedCustomer?.value?.value == null ? (
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
                <td>
                  <button
                    title="Eliminar Usuario"
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(partner._id)}
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
  );
};

export default Partners;
