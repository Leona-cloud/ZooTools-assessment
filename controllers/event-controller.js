const Payload = require("../model/payload");
const eventQueue = require("../services/consumer");


const createEvents = async (req, res) => {
  const payload = req.body;

  try {
    const savePayload = await Payload.create({
      metaData: payload,
      device: payload.user_agent_parsed,
      country: payload.geo_ip.country,
    });

    eventQueue.add(
      {
        device: payload.user_agent_parsed,
        country: payload.geo_ip.country,
        timeStamp: payload.timestamp,
      },
      {
        delay: 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "payload sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = createEvents;
