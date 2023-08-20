const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({

    metric: {
        type: String,
        required: true
    },

}, {timestamps: true});


const Metric = mongoose.model('Metric', metricSchema);



module.exports = Metric