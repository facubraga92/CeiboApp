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
  creationDate: { type: Date, default: Date.now },
  reply: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const projectNewsModel = mongoose.model("ProjectNews", projectNewsSchema);

module.exports = projectNewsModel;
