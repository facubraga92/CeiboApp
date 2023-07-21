function generateMailOptions(user, token) {
    const mailOptions = {
      from: "registro@ceibo.digital",
      to: user.email,
      subject: "email enviado usando Node.js",
      html: `<html>
          <head>
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
          }
  
          .container {
            background-color: #fff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
  
          p {
            color: #555;
            font-size: 16px;
            margin-bottom: 10px;
          }
  
          a {
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            display: inline-block;
          }
        </style>
          </head>
          <body>
            <div class="container">
              <h1>¡Gracias por registrarte, ${user.name} ${user.lastName}!</h1>
              <p>Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
              <p>
                <a target="_parent" href="http://localhost:5173/verification/${token}">
                  Confirmar cuenta
                </a>
              </p>
            </div>
          </body>
        </html>`,
    };
  
    return mailOptions;
  }
  
  module.exports = generateMailOptions;
  