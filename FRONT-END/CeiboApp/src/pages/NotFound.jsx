import React from "react";
import Layout from "../components/layouts/Layout";

function NotFound() {
  return (
    <Layout title={"Page not found"}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center mt-5">
              <h1 className="display-1">Error 404</h1>
              <p className="lead">
                La página que estás buscando no se encontró.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
