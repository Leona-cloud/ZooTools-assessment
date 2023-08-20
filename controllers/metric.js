const Metric = require("../model/metric");
const Payload = require("../model/payload");


const getMetrics = async(req, res)=>{

    try {

      const existingMetric = await Metric.findOne().sort({createdAt: -1})
      

      const metricTime = new Date(existingMetric.createdAt).getTime();
      const currentTime  =  Date.now();
      const timeDiff = currentTime - metricTime;
      const oneMinuteinMs =  60000;
     
      //check if metricExisting > one minute

      let metrics = {}

      if(timeDiff > oneMinuteinMs){
  
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
      
      
             metrics = {
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
  
              
      }else{

        metrics = JSON.parse(existingMetric.metric)
        console.log('here')
      }


            return res.status(200).json({
                success: true,
                message: "metric fetched successfully",
                data: metrics
            })
    } catch (error) {
        console.log(error.message)
    return  res.status(500).json({
        success: false,
        message: "Internal server error"
    });
    }

      
  

   

};



module.exports = getMetrics