const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    enum: ["NIVESH15", "NIVESH20", "NIVESH50"],
  },
  discount: {
    type: Number,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const SubscriptionSchema = new Schema({
  plan: {
    type: String,
    enum: ["Free", "Basic", "Premium", "Enterprise"],
    default: "Free",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "Cancelled"],
    default: "Active",
  },
  paymentMethod: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  appliedCoupon: CouponSchema,
});

const SubscriptionHistorySchema = new Schema({
  plan: String,
  startDate: Date,
  endDate: Date,
  paymentMethod: String,
  transactionId: String,
  appliedCoupon: {
    code: String,
    discount: Number,
  },
  status: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

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
  },
  vowel: {
    type: String,
  },
  subscription: { type: SubscriptionSchema, default: {} },
  subscriptionHistory: [SubscriptionHistorySchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  if (!this.subscription || !this.subscription.startDate) {
    const createdDate = this.date || new Date();
    const endDate = new Date(createdDate);
    endDate.setDate(endDate.getDate() + 1);

    this.subscription = {
      plan: "Free",
      startDate: createdDate,
      endDate: endDate,
      status: "Active",
    };
  }
  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
