const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT || 5001, () => {
    console.log("Connection Successful: Server is running");
  });
})
.catch((err) => console.error("DB Connection Error:", err));