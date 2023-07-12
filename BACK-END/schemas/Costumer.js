const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contactInfo: String,
  associatedProjects: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  ],
});

const customerModel = mongoose.model("Customer", customerSchema);

module.exports = customerModel;
