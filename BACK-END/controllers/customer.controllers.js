const customerModel = require("../schemas/Customer");

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
    res.status(201).send(newCustomer);
  } catch (error) {
    // Capturar error de validación de Mongoose
    if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

module.exports = { getAllCustomers , createCustomer };
