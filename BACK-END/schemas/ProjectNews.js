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
  modified_at: { type: Date, default: Date.now },
  week: { type: Number },
  priority: { type: Number },
  type: { type: String },
  reply: [
    {
      userId: { type: String },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const projectNewsModel = mongoose.model("ProjectNews", projectNewsSchema);

module.exports = projectNewsModel;
