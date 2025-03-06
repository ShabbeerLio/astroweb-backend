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

// Route to add a Gochar detail (Admin only) /api/admindetail/add
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

// Route to fetch all details (Accessible to all users) /api/admindetail/all
router.get("/all", async (req, res) => {
  try {
    const details = await AdminDetail.find().sort({ date: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to edit a specific Gochar entry (Admin only) /api/admindetail/edit/:id
router.put("/edit/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGochar = req.body;

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      return res.status(404).json({ message: "Admin details not found" });
    }

    const gocharIndex = adminDetail.gochar.findIndex(
      (g) => g._id.toString() === id
    );
    if (gocharIndex === -1) {
      return res.status(404).json({ message: "Gochar entry not found" });
    }

    adminDetail.gochar[gocharIndex] = {
      ...adminDetail.gochar[gocharIndex]._doc,
      ...updatedGochar,
    };
    await adminDetail.save();

    res
      .status(200)
      .json({ message: "Gochar updated successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete a specific Gochar entry (Admin only) /api/admindetail/delete/:id
router.delete("/delete/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      return res.status(404).json({ message: "Admin details not found" });
    }

    const initialLength = adminDetail.gochar.length;
    adminDetail.gochar = adminDetail.gochar.filter(
      (g) => g._id.toString() !== id
    );

    if (initialLength === adminDetail.gochar.length) {
      return res.status(404).json({ message: "Gochar entry not found" });
    }

    await adminDetail.save();
    res
      .status(200)
      .json({ message: "Gochar deleted successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Life Aspect

// Route to add a life_aspect detail (Admin only) /api/admindetail/lifeaspect/add
router.post("/lifeaspect/add", fetchUser, isAdmin, async (req, res) => {
  try {
    const { life_aspect } = req.body;

    if (!life_aspect) {
      return res.status(400).json({ message: "life_aspect is required" });
    }

    let adminDetail = await AdminDetail.findOne();

    if (!adminDetail) {
      adminDetail = new AdminDetail({ life_aspect });
    } else {
      adminDetail.life_aspect.push(...life_aspect);
    }

    await adminDetail.save();
    res
      .status(201)
      .json({ message: "life_aspect added successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to add a life_aspect detail (Admin only) /api/admindetail/lifeaspect/edit/:id
router.put("/lifeaspect/edit/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "id");
    const updatedLifeAspect = req.body;
    console.log(updatedLifeAspect, "updatedLifeAspect");

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      return res.status(404).json({ message: "Admin details not found" });
    }

    const LifeAspectIndex = adminDetail.life_aspect.findIndex(
      (g) => g._id.toString() === id
    );
    if (LifeAspectIndex === -1) {
      return res.status(404).json({ message: "life_aspect entry not found" });
    }

    adminDetail.life_aspect[LifeAspectIndex] = {
      ...adminDetail.life_aspect[LifeAspectIndex]._doc,
      ...updatedLifeAspect,
    };
    await adminDetail.save();

    res
      .status(200)
      .json({ message: "life_aspect updated successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to add a life_aspect detail (Admin only) /api/admindetail/lifeaspect/delete/:id
router.delete(
  "/lifeaspect/delete/:id",
  fetchUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      let adminDetail = await AdminDetail.findOne();
      if (!adminDetail) {
        return res.status(404).json({ message: "Admin details not found" });
      }

      const initialLength = adminDetail.life_aspect.length;
      adminDetail.life_aspect = adminDetail.life_aspect.filter(
        (g) => g._id.toString() !== id
      );

      if (initialLength === adminDetail.life_aspect.length) {
        return res.status(404).json({ message: "life_aspect entry not found" });
      }

      await adminDetail.save();
      res
        .status(200)
        .json({ message: "life_aspect deleted successfully", adminDetail });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

/* API Key Management */

// Route to add an API Key (Admin only)
router.post("/apikey/add", fetchUser, isAdmin, async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ message: "API Key is required" });
    }

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      adminDetail = new AdminDetail({ apiKey: [{ apiKey }] });
    } else {
      adminDetail.apiKey.push({ apiKey });
    }

    await adminDetail.save();
    res
      .status(201)
      .json({ message: "API Key added successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to edit an API Key entry (Admin only)
router.put("/apikey/edit/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { apiKey } = req.body;

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      return res.status(404).json({ message: "Admin details not found" });
    }

    const apiKeyIndex = adminDetail.apiKey.findIndex(
      (a) => a._id.toString() === id
    );
    if (apiKeyIndex === -1) {
      return res.status(404).json({ message: "API Key entry not found" });
    }

    adminDetail.apiKey[apiKeyIndex].apiKey = apiKey;
    await adminDetail.save();

    res
      .status(200)
      .json({ message: "API Key updated successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete an API Key entry (Admin only)
router.delete("/apikey/delete/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let adminDetail = await AdminDetail.findOne();
    if (!adminDetail) {
      return res.status(404).json({ message: "Admin details not found" });
    }

    const initialLength = adminDetail.apiKey.length;
    adminDetail.apiKey = adminDetail.apiKey.filter(
      (a) => a._id.toString() !== id
    );

    if (initialLength === adminDetail.apiKey.length) {
      return res.status(404).json({ message: "API Key entry not found" });
    }

    await adminDetail.save();
    res
      .status(200)
      .json({ message: "API Key deleted successfully", adminDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// monthly panchaang

async function fetchMonthlyPanchang() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  // Fetch API Key from Database
  let adminDetail = await AdminDetail.findOne();
  if (!adminDetail || !adminDetail.apiKey.length) {
    return res.status(400).json({ message: "API Key not found" });
  }

  const apiKey = adminDetail.apiKey[0].apiKey;
  try {
    const users = await User.find();
    const adminUser = users.find((user) => user.role === "admin");
    if (!adminUser) {
      console.log("No admin user found.");
      return;
    }
    const apiUrl = `https://api.vedicastroapi.com/v3-json/panchang/monthly-panchang?api_key=${apiKey}&date=${formattedDate}&lat=28.7041&lon=77.1025&tz=5.5&lang=en`;
    const response = await fetch(apiUrl);
    const panchangData = await response.json();

    if (!panchangData || Object.keys(panchangData).length === 0) {
      console.log("No Panchang data received.");
      return;
    }
    adminDetail.monthlyPanchang = panchangData;
    await adminDetail.save();
    console.log(`Panchang data updated successfully at ${formattedDate}`);
  } catch (error) {
    console.error("Error fetching or saving Panchang data:", error);
  }
}

// ⏰ Schedule task to run at **12:00 AM (midnight) every day**
cron.schedule("0 0 * * *", () => {
  console.log("Running fetchMonthlyPanchang at midnight...");
  fetchMonthlyPanchang();
});

fetchMonthlyPanchang();

router.get("/fetch-panchang", async (req, res) => {
  await fetchMonthlyPanchang();
  res.json({ message: "Panchang data fetched successfully" });
});

module.exports = router;
