const Bull = require("bull");
const Country = require("../model/country");
const Device = require("../model/device");
const TimeSeries = require("../model/timeseries");

const eventQueue = new Bull("eventQueue", `${process.env.redis}`);

const eventConsumer = async (job) => {
  const payload = job.data;
  const { device, country, timeStamp } = payload;

  console.log(payload, "here");

  // add to country count

  let countryExists = await Country.findOne({ country: country });
  if (!countryExists) {
    countryExists = new Country({
      country: country,
      count: 1,
    });
    await countryExists.save();
  }else{
    let updateCountryCount = countryExists.count + 1;
  console.log(updateCountryCount);
  await countryExists.updateOne({ country: country }).set({
    count: updateCountryCount,
  });

  }
  
  console.log(countryExists, "here");
  // add to device count

  let deviceType;

  if (device.is_mobile === true) {
    deviceType = "mobile";
  }
  if (device.is_desktop === true) {
    deviceType = "desktop";
  }
  if (device.is_tablet === true) {
    deviceType = "tablet";
  }

  let deviceExists = await Device.findOne({ device: deviceType });
  if (!deviceExists) {
    deviceExists = new Device({
      device: deviceType,
      count: 1,
    });
    await deviceExists.save();
  }else{
    let updateDeviceCount = deviceExists.count + 1;
  console.log(updateDeviceCount);
  await deviceExists.updateOne({ device: deviceType }).set({
    count: updateDeviceCount,
  });
  }
  

  console.log(deviceExists, "here");

  // add to time series count
  const timeInMilliseconds = parseInt(timeStamp) * 1000;
  const date = new Date(timeInMilliseconds);
  const formatTime = date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    minute: "numeric",
    hour: "numeric",
    second: "numeric",
    hour12: true,
  });
  let timestampExists = await TimeSeries.findOne({ time: formatTime });
  if (!timestampExists) {
    timestampExists = new TimeSeries({
      time: formatTime,
      totalOpens: 1,
    });
    await timestampExists.save();
  }else{
    let updateTimeCount = timestampExists.totalOpens + 1;
  console.log(updateTimeCount);
  await timestampExists.updateOne({ time: formatTime }).set({
    totalOpens: updateTimeCount,
  });
  }
  

  console.log(timestampExists, "here");
};

eventQueue.process(eventConsumer);

module.exports = eventQueue;
