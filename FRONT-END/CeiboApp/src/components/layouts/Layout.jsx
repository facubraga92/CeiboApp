import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "../ui/Navbar";
import Footer from "../ui/Footer";

function Layout({hasNotFooter , children, title }) {
  return (
    <>
      <Helmet>
        <title>{title || "CEIBOAPP"}</title>
      </Helmet>
      <NavBar />
      <main>{children}</main>
 {hasNotFooter ? <></>:     <Footer  />}
    </>
  );
}

export default Layout;
