import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "../ui/Navbar";
import Footer from "../ui/Footer";

function Layout({ children, title }) {
  return (
    <>
      <Helmet>
        <title>{title || "CEIBOAPP"}</title>
      </Helmet>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
