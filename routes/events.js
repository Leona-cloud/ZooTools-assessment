const express = require('express');
const router = express.Router();


const createEvents = require('../controllers/event');
const getMetrics = require('../controllers/metric');


router.post('/events', createEvents);
router.get('/metrics', getMetrics);






module.exports = router