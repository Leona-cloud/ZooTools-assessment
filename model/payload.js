const mongoose = require('mongoose');

const payloadSchema = new mongoose.Schema({
   device: {
    type: Object
   },
   country: {
    type: String
   },
   metaData: {
    type: Object
   }
}, {timestamps: true});


const Payload = mongoose.model('Payload', payloadSchema);



module.exports = Payload