import Layout from "../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

export default function Profile() {
  const [isChanges, setIsChanges] = useState(false);

  const navigate = useNavigate();

  // INICIALIZAR CON VALORES DESDE LA API
  const [inputs, setInputs] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "email prueba",
  });

  const [initialState, setInitialState] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "email prueba",
  });

  useEffect(() => {
    setIsChanges(JSON.stringify(inputs) !== JSON.stringify(initialState));
  }, [inputs]);

  const [disabled, setDisabled] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value === "") {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputs((values) => ({ ...values, [name]: value }));
    }
    return;
  };

  const handleDisabled = () => {
    setDisabled(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // por ahora vuelve al home
    return navigate("/");
  };

  const handleCancelChanges = (e) => {
    e.preventDefault();
    setDisabled(true);
    setIsChanges(false);
    return setInputs(initialState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (selectInput === "default") return;

    // por ahora no hace nada, simula un envio de datos, a la espera de la ruta para editar perfil
    console.log(inputs);
    return handleRedirect();
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
              <form action="" method="post" onSubmit={handleSubmit}>
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
                  {disabled ? (
                    <>
                      <input
                        className="btn btn-outline-warning col-sm-3 col-md-2 mx-2 "
                        value={"Volver"}
                        type="button"
                        onClick={handleCancel} // hacer handle para volver
                      />
                      <input
                        type="button"
                        value="Editar"
                        onClick={handleDisabled}
                        className="btn btn-primary col-sm-3 col-md-2 mx-2"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="button"
                        value="Cancelar"
                        onClick={handleCancelChanges}
                        className="btn btn-danger col-sm-3 col-md-2 mx-2"
                      />
                      <input
                        type="submit"
                        value="Guardar"
                        className="btn btn-primary col-sm-3 col-md-2 mx-2"
                      />
                    </>
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
