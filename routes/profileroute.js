const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const UserInfo = require("../models/UserInfoSchema");

router.post("/user/profile", authenticate, async (req, res) => {
  try {
    const {  
      fullName,
      address,
      dob,
      nic,
      telephone,
      weight,
      height } = req.body;
    const userId = req.rootUser._id;
    const userInfo = new UserInfo({
      userId,
      fullName,
      address,
      dob,
      nic,
      telephone,
      weight,
      height
    });
    await userInfo.save();
    res.status(201).json({ status: 201, message: "Data added successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

module.exports = router;
