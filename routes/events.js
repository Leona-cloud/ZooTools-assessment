const express = require("express");
const router = express.Router();

const createEvents = require("../controllers/event-controller");
const getMetrics = require("../controllers/metric-controller");

router.post("/events", createEvents);
router.get("/metrics", getMetrics);

module.exports = router;
