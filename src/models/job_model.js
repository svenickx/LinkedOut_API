const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
