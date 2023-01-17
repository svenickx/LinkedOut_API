const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
