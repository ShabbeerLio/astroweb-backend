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
  detail: {
    type: String,
  },
});

module.exports = mongoose.model("detail", DetailSchema);
