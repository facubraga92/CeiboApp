import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../ui/Navbar";

function Layout({ children, title }) {
  return (
    <>
      <Helmet>
        <title>{title || "CEIBOAPP"}</title>
      </Helmet>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default Layout;
