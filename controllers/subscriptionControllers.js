const User = require("../models/User");

// Assign Subscription with Optional Coupon
exports.assignSubscription = async (req, res) => {
  try {
    const { plan, endDate, paymentMethod, transactionId, couponCode } =
      req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    let coupon = null;

    // Apply coupon if provided
    if (couponCode) {
      const validCoupons = {
        NIVESH15: 15,
        NIVESH20: 20,
        NIVESH50: 50,
      };

      if (!validCoupons[couponCode]) {
        return res.status(400).json({ error: "Invalid coupon code" });
      }

      coupon = {
        code: couponCode,
        discount: validCoupons[couponCode],
        used: true,
      };
    }

    user.subscription = {
      plan,
      startDate: new Date(),
      endDate,
      status: "Active",
      paymentMethod,
      transactionId,
      appliedCoupon: coupon,
    };

    // Add to history
    user.subscriptionHistory.push({
      plan,
      startDate: new Date(),
      endDate,
      paymentMethod,
      transactionId,
      appliedCoupon: coupon,
      status: "Active",
    });

    await user.save();
    res.json({ success: true, subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Check Subscription Status
exports.checkSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.subscription)
      return res.status(404).json({ error: "Subscription not found" });

    const today = new Date();
    if (user.subscription.endDate && today > user.subscription.endDate) {
      user.subscription.status = "Expired";
      await user.save();
    }

    res.json({ subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Unsubscribe (Cancel Subscription)
exports.unsubscribe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.subscription)
      return res.status(404).json({ error: "Subscription not found" });

    user.subscription.status = "Cancelled";

    // Save to history
    user.subscriptionHistory.push({
      plan: user.subscription.plan,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      paymentMethod: user.subscription.paymentMethod,
      transactionId: user.subscription.transactionId,
      appliedCoupon: user.subscription.appliedCoupon
        ? {
            code: user.subscription.appliedCoupon.code,
            discount: user.subscription.appliedCoupon.discount,
          }
        : null,
      status: "Cancelled",
    });

    await user.save();

    res.json({ success: true, message: "Subscription cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
