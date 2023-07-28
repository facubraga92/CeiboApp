import React, { useState, useEffect } from "react";
import { Spin, Result } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { envs } from "../config/env/env.config";

const VerificationPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState("");
  const tokenWithDots = token.replace(/@/g, ".");

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(
          `${VITE_BACKEND_URL}/users/verify-account/${tokenWithDots}`,
          { token },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((response) => {
          const { data } = response;
          setVerificationResult(data);
          setLoading(false);
        })
        .catch((error) => {
          setVerificationResult(
            `Error en la verificación de la cuenta. ${error.response.data}`
          );
          setLoading(false);
        });
    }, 1500);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Result
          status={
            verificationResult.includes("exitosamente") ? "success" : "error"
          }
          title={verificationResult}
        />
      )}
    </div>
  );
};

export default VerificationPage;
