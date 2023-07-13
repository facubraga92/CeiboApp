const express = require("express");

const customerRouter = express.Router();
const {
  getAllCustomers,
  createCustomer,
} = require("../controllers/customer.controllers");
const isManager = require("../middlewares/isManager");

customerRouter.get("/all", getAllCustomers);

customerRouter.post("/create", isManager, createCustomer);

module.exports = customerRouter;
