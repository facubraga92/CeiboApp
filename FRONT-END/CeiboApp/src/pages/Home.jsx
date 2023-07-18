import React from "react";
import Layout from "../components/layouts/Layout";
import Login from "./Login";

const Home = () => {
  return (
    <Layout title="Home">
      <div className="container">
        <div className="row">
          <div>Login google</div>
          <Login />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
