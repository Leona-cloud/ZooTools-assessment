const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const events = require('./routes/events');



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', events)



 mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.error("unable to connect", err));

const port = process.env.PORT || 4000;


 app.listen(port, () => {
  console.log(`server connected to ${port}`);
});
