const mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const Project = require("../schemas/Project");
const User = require("../schemas/User");

const getPartnersAssociate = async (projectId) => {
  try {
    const project = await Project.findById(projectId).populate("customer");
    if (!project) {
      console.error("Proyecto no encontrado");
      return;
    }

    const associatedCustomers = project.customer._id;
    const partners = await User.find({ role: "socio", associatedCustomers });

    if (partners.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_NOTIFICATION,
          pass: process.env.PASSWORD_NOTIFICATION,
        },
      });
      const mailGenerator = new mailgen({
        theme: "salted",
        product: {
          name: "Ceibo",
          link: "http://localhost:5173",
        },
        signature: "Atentamente, equipo de desarrollo",
      });
      const emailBody = {
        body: {
          name: "Socio",
          intro:
            "Se ha aprobado una novedad en uno de los proyectos que estás gestionando:",
          table: {
            data: [
              {
                item: "Proyecto:",
                description: project.name,
              },
            ],
            columns: {
              customWidth: {
                item: "20%",
                description: "80%",
              },
              customAlignment: {
                item: "right",
                description: "left",
              },
            },
          },
          outro: "Gracias por utilizar nuestra aplicacion!",
        },
      };
      const emailBodyHtml = mailGenerator.generate(emailBody);

      const mailOptions = {
        from: process.env.EMAIL_NOTIFICATION,
        to: partners.map((partner) => partner.email).join(", "),
        subject: `Novedad aprobada en el proyecto "${project.name}"`,
        html: emailBodyHtml,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log("Correo electrónico enviado:", info.response);
        }
      });
    }
  } catch (error) {
    console.error("Error al obtener los socios asociados:", error);
  }
};

module.exports = getPartnersAssociate;
