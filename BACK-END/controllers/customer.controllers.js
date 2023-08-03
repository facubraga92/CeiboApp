const customerModel = require("../schemas/Customer");
const projectModel = require("../schemas/Project");
const projectNewsModel = require("../schemas/ProjectNews");
const userModel = require("../schemas/User");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find().populate("associatedProjects");
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
    res.status(201).send("Cliente creado con Éxito.");
  } catch (error) {
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
    const projects = await projectModel
      .find({ customer: customerId })
      .select("_id");

    await projectNewsModel.deleteMany({ associatedProject: { $in: projects } });

    await projectModel.deleteMany({ customer: customerId });

    await userModel.updateMany(
      { associatedCustomers: customerId },
      {
        $unset: { associatedCustomers: 1 },
      }
    );

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
        new: true,
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
