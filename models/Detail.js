const mongoose = require("mongoose");
const { Schema } = mongoose;

const DetailSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  horoscopeData: {
    type: Object,
  },
  dashas: {
    type: Object,
  },
  rashiData: {
    type: Object,
  },
  chart1Url: {
    type: String,
  },
  chart2Url: {
    type: String,
  },
});

module.exports = mongoose.model("detail", DetailSchema);
