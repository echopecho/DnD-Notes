const router = require("express").Router();

const Campaigns = require("./campaign-helper.js");

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaigns.getAll();
    res.status(201).json(campaigns);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong with the server." });
  }
});

router.post("/", async (req, res) => {
  const campaign = req.body;

  try {
    const newCampaign = await Campaigns.create(campaign);
    res.status(201).json(newCampaign);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong with the server." });
  }
});

module.exports = router;