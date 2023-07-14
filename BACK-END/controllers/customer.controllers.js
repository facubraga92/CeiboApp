const customerModel = require("../schemas/Customer");
const projectModel = require("../schemas/Project");
const projectNewsModel = require("../schemas/ProjectNews");
const userModel = require("../schemas/User");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();
    res.send(customers);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: error.message });
  }
};

const createCustomer = async (req, res) => {
  const customer = new customerModel(req.body);
  try {
    const newCustomer = await customer.save();
    res.status(201).send('Cliente creado con Éxito.');
  } catch (error) {
    // Capturar error de validación de Mongoose
    if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

const deleteCustomer = async (req, res) => {
  const customerId = req.params.id;

  try {
    // Obtener los proyectos asociados al customer
    const projects = await projectModel
      .find({ customer: customerId })
      .select("_id");

    // Eliminar las noticias de proyecto asociadas a los proyectos
    await projectNewsModel.deleteMany({ associatedProject: { $in: projects } });

    // Eliminar los proyectos asociados al customer
    await projectModel.deleteMany({ customer: customerId });

    // Actualizar los usuarios asociados al customer eliminado
    await userModel.updateMany(
      { associatedCustomer: customerId },
      {
        $unset: { associatedCustomer: 1 },
        $pull: { associatedProjects: { $in: projects } },
      }
    );

    // Eliminar el customer
    const deletedCustomer = await customerModel.findByIdAndDelete(customerId);
    res.status(200).send({
      message: "Customer eliminado exitosamente",
      customer: deletedCustomer,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const updates = req.body;

  try {
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      updates,
      {
        new: true, // Devolver el documento actualizado
      }
    );

    if (!updatedCustomer) {
      return res
        .status(404)
        .send({ message: "No se encontró el cliente especificado" });
    }

    res.status(200).send({
      message: "Cliente actualizado exitosamente",
      customer: updatedCustomer,
    });
  } catch (error) {
    // Capturar error de validación de Mongoose
    if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
