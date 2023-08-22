const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({

    device: {
        type: String,
        unique: true
    },
    count: {
        type: Number,
        default: 1
    }

});


const Device = mongoose.model('Device', deviceSchema);


module.exports = Device
