const Metric = require("../model/metric");
const Payload = require("../model/payload");


const performAggregate = async(req, res)=>{


    try {
        const opensByCountries = await Payload.aggregate([
            {
              $group: {
                _id: '$country',
                count: { $sum: 1 },
              },
            },
          ]);
    
          const opensByDevice = await Payload.aggregate([
            {
              $group: {
                _id: '$device.device_family',
                count: { $sum: 1 },
              },
            },
          ]);
    
          const timestampData = await Payload.aggregate([
            {
                $group: {
                  _id: {
                    $toDate: {
                      $multiply: [{$toInt : '$metaData.timestamp'}, 1000] 
                    }
                  },
                  totalOpens: { $sum: 1 },
                },
              }
          ]);
    
    
          const metrics = {
            opens_by_countries: opensByCountries.reduce((acc, entry) => {
              acc[entry._id] = entry.count;
              return acc;
            }, {}),
            opens_by_device: opensByDevice.reduce((acc, entry) => {
              acc[entry._id] = entry.count;
              return acc;
            }, {}),
            timeseries: timestampData.map(entry => ({
                totalOpens: entry.totalOpens,
                time: entry._id.toLocaleString(), 
              })),
            };

            const stringifyMetric = JSON.stringify(metrics)

             await Metric.create({
                metric: stringifyMetric
            });

            return true

    } catch (error) {
         console.log("Aggregate-failed", error.message);
            return false;
    }


};



module.exports = performAggregate;