import React from "react";
import Layout from "../components/layouts/Layout";
import { useSpring, animated } from "react-spring";

const AccountValidationMessage = () => {
  const animations = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 500 },
  });

  return (
  <Layout>
      <div style={{ height: "50vh" }} className="container">
        <animated.div style={animations} className="not-found-content">
          <h1>Valida tu cuenta</h1>
          <p className="mt-4 fs-1 fw-bold">
            Es necesario que valides tu cuenta para poder acceder al sitio. Por
            favor, revisa tu correo electrónico y sigue las instrucciones para
            completar la validación.
          </p>
        </animated.div>
      </div>
    </Layout>
  );
};

export default AccountValidationMessage;
