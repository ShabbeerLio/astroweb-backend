const express = require("express");
const router = express.Router();
const Detail = require("../models/Detail");
var fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

// route1 : Get all category using GET: "/api/detail/fetchalldetail" login required
router.get("/fetchalldetail", fetchuser, async (req, res) => {
  try {
    const clients = await Detail.find({ user: req.user.id });
    res.json(clients);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// route2 : Add new category using POST: "/api/detail/adddetail" login required
router.post("/adddetail", fetchuser, async (req, res) => {
  try {
    const { horoscopeData, dashas,rashiData, chart1Url, chart2Url } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const Category = new Detail({
      horoscopeData,
      dashas,
      rashiData,
      chart1Url,
      chart2Url,
      user: req.user.id,
    });
    const savedDetail = await Category.save();
    res.json(savedDetail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
