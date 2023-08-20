const Payload = require("../model/payload");
const performAggregate = require("../utils/aggregate");



const createEvents = async(req, res)=>{

    const payload = req.body;

try {
    
    const savePayload = await Payload.create({
        metaData: payload,
        device: payload.user_agent_parsed,
        country: payload.geo_ip.country
    });

    await performAggregate();

    return res.status(200).json({
        success: true,
        message: 'payload sent successfully'
    })
} catch (error) {
    console.log(error.message)
   return  res.status(500).json({
        success: false,
        message: "Internal server error"
    });

    
}




 

};



module.exports = createEvents