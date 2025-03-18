const cron = require("node-cron");
const User = require("../models/User");

const checkSubscriptions = async () => {
  try {
    console.log("Running daily subscription check...");

    const users = await User.find({
      $or: [
        { "subscription.endDate": { $exists: true } },
        { "subscriptionHistory.endDate": { $exists: true } },
      ],
    });

    const today = new Date();

    for (let user of users) {
      let modified = false;

      /** Check current active subscription */
      if (user.subscription.endDate && today >= user.subscription.endDate + 1) {
        if (user.subscription.status !== "Expired") {
          user.subscription.status = "Expired";
          modified = true;
          console.log(`Active subscription expired for: ${user.email}`);
        }
      }

      /** Check ALL entries in subscriptionHistory */
      user.subscriptionHistory.forEach((history) => {
        if (history.endDate && today >= history.endDate + 1) {
          if (history.status !== "Expired") {
            history.status = "Expired";
            modified = true;
            console.log(
              `Updated history subscription to expired for: ${user.email}`
            );
          }
        }
      });

      /** Save only if something changed */
      if (modified) {
        await user.save();
      }
    }

    console.log("Subscription check completed.");
  } catch (err) {
    console.error("Error checking subscriptions:", err);
  }
};

// Schedule: Run every day at midnight
const startSubscriptionCron = () => {
  checkSubscriptions();
  //   cron.schedule("0 0 * * *", () => {
  //   });
  console.log("Subscription Cron Job Scheduled - Runs every day at 12:00 AM");
};

module.exports = startSubscriptionCron;
