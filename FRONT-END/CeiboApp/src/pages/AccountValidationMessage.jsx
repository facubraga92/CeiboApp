import React from "react";
import Layout from "../components/layouts/Layout";

const AccountValidationMessage = () => {
  return (
    <Layout>
      <>
        <div className="container">
          <h1>Valida tu cuenta</h1>
          <p className="mt-4 fs-1 fw-bold">
            Es necesario que valides tu cuenta para poder acceder al sitio. Por
            favor, revisa tu correo electrónico y sigue las instrucciones para
            completar la validación.
          </p>
        </div>
      </>
    </Layout>
  );
};

export default AccountValidationMessage;
