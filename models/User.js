const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  birthtime: {
    type: String,
    required: true,
  },
  birthplace: {
    type: String,
    required: true,
  },
  consonent: {
    type: String,
    required: true,
  },
  vowel: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
