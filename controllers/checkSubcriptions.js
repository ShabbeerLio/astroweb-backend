const cron = require("node-cron");
const User = require("../models/User");

const checkSubscriptions = async () => {
  try {
    console.log("Running daily subscription check...");

    const users = await User.find({ "subscription.endDate": { $exists: true } });

    const today = new Date();

    for (let user of users) {
      if (user.subscription.endDate && today > user.subscription.endDate) {
        if (user.subscription.status !== "Expired") { // Avoid unnecessary saves
          user.subscription.status = "Expired";
          await user.save();
          console.log(`Subscription expired for: ${user.email}`);
        }
      }
    }

    console.log("Subscription check completed.");
  } catch (err) {
    console.error("Error checking subscriptions:", err);
  }
};

// Schedule: Run every day at midnight
const startSubscriptionCron = () => {
  cron.schedule("0 0 * * *", () => {
    checkSubscriptions();
  });
  console.log("Subscription Cron Job Scheduled - Runs every day at 12:00 AM");
};

module.exports = startSubscriptionCron;