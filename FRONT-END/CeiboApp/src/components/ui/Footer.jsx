import React from "react";

export default function Footer() {
  return (
    <>
      <div style={{ height: "50vh", position: "relative" }}>
        <footer
          style={{
            height: "200px",
            backgroundColor: "#b72837",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            padding: "0 16px",
            position: "absolute", // Cambiamos la posición a absolute
            left: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/ceibo-white.png"
              alt="Logo"
              style={{
                maxWidth: "120px",
                height: "auto",
                cursor: "pointer",
                marginRight: "16px",
              }}
              onClick={() =>
                window.open("https://ceibo.digital/publicaciones/", "_blank")
              }
            />
            <div>
              <p>Buenos Aires</p>
              <p>Espacio Circular Innova</p>
              <p>Miami</p>
              <p>777 Brickell Ave</p>
              <p>Suite 1210, FL, (33131)</p>
              <p>Asunción</p>
              <p>World Trade Center</p>
            </div>
          </div>
          <div>
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
        </footer>
      </div>
    </>
  );
}
