const mongoose = require("mongoose");
const { Schema } = mongoose;

const GocharSchema = new mongoose.Schema({
  planet_name: {
    type: String,
    required: true,
  },
  rashi: {
    type: String,
    required: true,
  },
  nakshatra: {
    type: String,
    required: true,
  },
  pada: {
    type: Number,
    required: true,
  },
  combust: {
    type: Boolean,
    required: true,
  },
  motion: {
    type: String,
    enum: ["direct", "retrograde"],
    required: true,
  },
  date_of_entry: {
    type: Date,
    required: true,
  },
  date_of_exit: {
    type: Date,
    required: true,
  },
});

const AdminDetailSchema = new Schema({
  gochar: [GocharSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("adminDetail", AdminDetailSchema);
