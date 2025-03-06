const mongoose = require("mongoose");
const { Schema } = mongoose;

const LifeAspectSchema = new mongoose.Schema({
  planet_name: {
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
  results: {
    type: String,
    required: true,
  },
});

const ApiSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    require: true,
  },
});

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
    type: String,
    required: true,
  },
  date_of_exit: {
    type: String,
    required: true,
  },
});

const AdminDetailSchema = new Schema({
  gochar: [GocharSchema],
  life_aspect: [LifeAspectSchema],
  monthlyPanchang: {
    type: Object,
  },
  apiKey: [ApiSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("adminDetail", AdminDetailSchema);
