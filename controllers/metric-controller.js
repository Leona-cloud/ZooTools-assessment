const Country = require("../model/country");
const Device = require("../model/device");
const TimeSeries = require("../model/timeSeries");

const getMetrics = async (req, res) => {
  try {
    const country = await Country.find();

    const device = await Device.find();

    const timeseries = await TimeSeries.find();

    const opens_by_countries = country.reduce((acc, entry) => {
      acc[entry.country] = entry.count;
      return acc;
    }, {});

    const opens_by_device = device.reduce((acc, entry) => {
      acc[entry.device] = entry.count;
      return acc;
    }, {});

    const timeSeries = timeseries.map((entry) => ({
      totalOpens: entry.totalOpens,
      time: entry.time,
    }));

    console.log(timeSeries, "hello");

    return res.status(200).json({
      success: true,
      message: "metric fetched successfully",
      data: {
        opens_by_countries: opens_by_countries,
        opens_by_device: opens_by_device,
        timeSeries: timeSeries
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      
    });
  }
};

module.exports = getMetrics;
