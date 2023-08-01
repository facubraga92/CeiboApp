import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import {useSpring, animated} from "react-spring"
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(5);

  const animations = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 500 },
  })
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/"); 
    }
  }, [seconds, navigate]);
  return (
    <Layout title={"Page not found"}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="not-found">
             <animated.div style={animations} className="not-found-content">
               <h1 className="display-1">Error 404</h1>
               <p className="lead">Página no encontrada</p>
               <p className="lead">Redireccionando en {seconds} segundos...</p>
             </animated.div>
          </div> 
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
