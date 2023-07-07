//subscription update schedular codes
const cron = require("node-cron");
const Subscription = require("../models/subscriptionSchema"); 

const scheduleSubscriptionUpdate = () => {
  cron.schedule("0 0 1 * *", async () => {
    try {
      // Get all user subscriptions
      const subscriptions = await Subscription.find();

      // Update the subscriptions accordingly
      for (const subscription of subscriptions) {
        // Calculate the new endDate by adding one month to the current endDate
        const currentEndDate = subscription.endDate;
        const newEndDate = new Date(currentEndDate.getFullYear(), currentEndDate.getMonth() + 1, 1);

        // Update the subscription with the new endDate
        subscription.endDate = newEndDate;
        await subscription.save();
      }

      console.log("User subscriptions updated successfully");
    } catch (error) {
      console.log("Error updating user subscriptions:", error);
    }
  });
};

module.exports = scheduleSubscriptionUpdate;
