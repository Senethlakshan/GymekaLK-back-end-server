const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const User = require("../models/userSchema");
const Subscription = require("../models/subscriptionSchema");

// Subscribe to a package
router.post("/subscribe", authenticate, async (req, res) => {
  try {
    const { packageId } = req.body;

    const currentDate = new Date();
    const startDate = currentDate;
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Check if the user already has a subscription for the current month
    const existingSubscription = await Subscription.findOne({
      userId: req.userId,
      startDate: { $gte: startDate, $lt: endDate },
    });

    if (existingSubscription) {
      return res.status(400).json({
        status: 400,
        message: "You have already subscribed to a package this month",
      });
    }

    // Check if the user has any subscription for the current month, even if it has ended
    const previousSubscription = await Subscription.findOne({
      userId: req.userId,
      endDate: { $gte: startDate, $lt: endDate },
    });

    if (previousSubscription) {
      return res.status(400).json({
        status: 400,
        message: "You have already subscribed to a package this month",
      });
    }

    // Create a new subscription
    const subscription = new Subscription({
      userId: req.userId,
      packageId,
      startDate,
      endDate,
    });

    // Save the subscription to the database
    await subscription.save();

    // Save the subscription to the user's subscriptions array
    const user = await User.findById(req.userId);
    user.subscriptions.push(subscription);
    await user.save();

    res.status(201).json({ status: 201, message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
});


// Get subscription history for the authenticated user
router.get("/history", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("subscriptions");

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const subscriptions = user.subscriptions;

    res.status(200).json({ status: 200, subscriptions });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
});



module.exports = router;
