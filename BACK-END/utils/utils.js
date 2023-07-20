const nodemailer = require("nodemailer")
const mailgen = require("mailgen")
const ProjectModel = require("../schemas/Project")
const UserModel = require("../schemas/User")

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_NOTIFICATION, 
      pass: process.env.PASSWORD_NOTIFICATION, 
    },
  });

const sendEmailToManager = (managerEmail, projectName, newsTitle) => {
    const mailGenerator = new mailgen({
        theme: "salted",
        product: {
          name: "Ceibo",
          link: "http://localhost:5173", 
        },
        signature: "Atentamente, equipo de desarrollo"
      });
    
      const emailBody = {
        body: {
          name: "Manager", 
          intro: "Se ha realizado un cambio en uno de los proyectos que estás gestionando:",
          table: {
            data: [
              {
                item: "Proyecto:",
                description: projectName,
              },
              {
                item: "Novedad:",
                description: newsTitle,
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
        from: "practicaceibo@gmail.com",
        to: managerEmail,
        subject: `Notificación de cambio en el proyecto "${projectName}"`,
        html: emailBodyHtml,
      };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
};

const getManagersRelevants = async (projectNews) => {
    const relevantManagers = [];
    try {
      const project = await ProjectModel.findById(projectNews.associatedProject);
  
      if (!project) {
        throw new Error('El proyecto asociado a la projectNews no existe.');
      }
      relevantManagers.push(...project.managers);
  
      for (const managerId of relevantManagers) {
          try {
            const manager = await UserModel.findById(managerId);
            if (!manager) {
              throw new Error('El manager no existe.');
            }
            sendEmailToManager(manager.email, project.name, projectNews.title);
      
          } catch (error) {
            console.error('Error al obtener el manager o enviar el correo electrónico:', error);
          }
      }
    } catch (error) {
      console.error('Error al obtener managers relevantes:', error);
    }
  };



module.exports = getManagersRelevants