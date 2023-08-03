import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "200px",
        backgroundColor: "#b72837",
        display: "block",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        padding: "50px",
        position: "relative",
        left: 0,
        bottom: 0,
        width: "100%",
      }}
    >
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-4 text-center">
          <img
            src="/ceibo-white.png"
            alt="Logo"
            style={{
              maxWidth: "240px",
              height: "auto",
              cursor: "pointer",
              marginRight: "16px",
            }}
            onClick={() =>
              window.open("https://ceibo.digital/publicaciones/", "_blank")
            }
          />
        </div>
        <div className="col-md-4 text-center my-5">
          <p style={{ fontWeight: "bold" }}>Buenos Aires</p>
          <p>Espacio Circular Innova</p>
          <p style={{ fontWeight: "bold" }}>Miami</p>
          <p>777 Brickell Ave</p>
          <p>Suite 1210, FL, (33131)</p>
          <p style={{ fontWeight: "bold" }}>Asunción</p>
          <p>World Trade Center</p>
        </div>
        <div className="col-md-4 text-center my-5">
          <a
            href="https://www.instagram.com/ceibodigital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/instagram.png"
              alt="Instagram"
              style={{
                width: "32px",
                height: "32px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
          </a>
          <a
            href="https://www.linkedin.com/company/ceibodigital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/linkedin-icon2.png"
              alt="LinkedIn"
              style={{ width: "32px", height: "32px", cursor: "pointer" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
