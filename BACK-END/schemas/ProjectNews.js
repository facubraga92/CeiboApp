const mongoose = require("mongoose");

const projectNewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  associatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  state: {
    type: String,
    enum: ["pendiente", "aprobada", "modificada"],
    default: "pendiente",
  },
  created_at: {
    type: Date,
    default: Date.now,
    setDefaultsOnInsert: true,
  },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approved_date: { type: Date },
  modified_at: { type: Date, default: Date.now },
  week: { type: Number },
  priority: { type: Number },
  type: { type: String },
  reply: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
  logs: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      description: String,
    },
  ],
});

const projectNewsModel = mongoose.model("ProjectNews", projectNewsSchema);

module.exports = projectNewsModel;
