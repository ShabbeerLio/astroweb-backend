const express = require("express");
const router = express.Router();
const AdminDetail = require("../models/AdminDetail");
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};

// Route to add a detail (Admin only)
router.post("/add", fetchUser, isAdmin, async (req, res) => {
  try {
    const { gochar } = req.body;

    if (!gochar) {
      return res.status(400).json({ message: "Gochar is required" });
    }
    let adminDetail = await AdminDetail.findOne();

    if (!adminDetail) {
      adminDetail = new AdminDetail({ gochar });
    } else {
      adminDetail.gochar.push(...gochar); 
    }

    await adminDetail.save();
    res.status(201).json({ message: "Gochar added successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to fetch all details (Accessible to all users)
router.get("/all", async (req, res) => {
  try {
    const details = await AdminDetail.find().sort({ date: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
