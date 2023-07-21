const express = require("express");

const customerRouter = express.Router();
const {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customer.controllers");
const isManager = require("../middlewares/isManager");

customerRouter.get("/all", getAllCustomers);

customerRouter.post("/create", isManager, createCustomer);

customerRouter.delete("/:id", isManager, deleteCustomer);

customerRouter.put("/:id", isManager, updateCustomer);

module.exports = customerRouter;
