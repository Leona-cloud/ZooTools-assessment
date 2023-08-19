const Payload = require("../model/payload");


const getMetrics = async(req, res)=>{

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

            return res.status(200).json({
                success: true,
                message: "metric fetched successfully",
                data: metrics
            })
    } catch (error) {
        console.log(error.message)
    return  res.status(500).json({
        success: false,
        message: "something went wrong"
    });
    }

      
  

   

};



module.exports = getMetrics