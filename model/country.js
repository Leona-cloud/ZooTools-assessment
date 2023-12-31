const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({

    country: {
        type: String,
        unique: true
    },
    count: {
        type: Number,
        default: 1
    }

});


const Country = mongoose.model('Country', countrySchema);


module.exports = Country
