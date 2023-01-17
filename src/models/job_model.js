const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
