const mongoose = require("mongoose");

const freelanceSchema = mongoose.Schema({
  dailyPrice: {
    type: Number,
    required: true,
  },
  yearlyExperience: {
    type: Number,
    required: true,
  },
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Freelance", freelanceSchema);
