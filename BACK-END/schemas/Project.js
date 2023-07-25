const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  code: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  consultors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  news: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectNews" }],
  created_at: {
    type: Date,
    default: Date.now,
    setDefaultsOnInsert: true,
  },
  modified_at: { type: Date, default: Date.now },
});

const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;
