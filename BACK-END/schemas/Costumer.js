const mongoose = require("mongoose");

const costumerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contactInfo: String,
  associatedProjects: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  ],
});

const costumerModel = mongoose.model("Costumer", costumerSchema);

module.exports = costumerModel;
