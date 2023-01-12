const mongoose = require("mongoose");

const propositionSchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mission",
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Proposition", propositionSchema);
