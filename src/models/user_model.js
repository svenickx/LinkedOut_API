const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    maxLength: 50,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
    minLength: 6,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  address: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  city: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 15,
  },
});

module.exports = mongoose.model("User", userSchema);

// userSchema.pre("save", (next) => {
//   let hashedPassword = bcrypt.hashSync(this.password, 10);
//   console.log(hashedPassword);
//   this.password = hashedPassword;
//   next();
// });
