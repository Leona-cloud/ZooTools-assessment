const mongoose = require('mongoose');

const timeSeriesSchema = new mongoose.Schema({

    time: {
        type: String,
        unique: true
    },
    totalOpens: {
        type: Number,
        default: 1
    }

});


const TimeSeries = mongoose.model('TimeSeries', timeSeriesSchema);


module.exports = TimeSeries
