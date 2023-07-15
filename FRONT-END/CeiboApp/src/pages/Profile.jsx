import Layout from "../components/layouts/Layout";
import React, { useState } from "react";

export default function Profile() {
  const [inputs, setInputs] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "email prueba",
  });

  const [disabled, setDisabled] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    return setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDisabled = () => {
    setDisabled(false);
  };

  return (
    <Layout title="Profile">
      <div className="mt-4 p-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-6">
            <div>
              <h2>Editar Perfil</h2>
            </div>
            <div className="">
              <form action="" method="post">
                <div className="form-group">
                  <label htmlFor="">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    id=""
                    className="form-control"
                    value={inputs.name || ""}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    id=""
                    className="form-control"
                    value={inputs.lastName || ""}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Email</label>
                  <input
                    type="text"
                    name="email"
                    id=""
                    className="form-control"
                    value={inputs.email || ""}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="text-center p-3">
                  {disabled && (
                    <input
                      type="button"
                      value="Habilitar edicion"
                      onClick={handleDisabled}
                      className="btn btn-primary"
                    />
                  )}

                  {!disabled && (
                    <input
                      type="submit"
                      value="Guardar cambios"
                      className="btn btn-danger"
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
