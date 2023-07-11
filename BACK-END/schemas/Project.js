const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  consultors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;
