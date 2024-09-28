const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/routegroups'); 
const userRoutes = require('./routes/userRoutes'); 
const {parseCSVAndStoreData} = require('./utils/csvParser');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const importCSV = async () => {
  const csvFilePath = './public/student.csv'; 
  parseCSVAndStoreData(csvFilePath);
};

importCSV();

// Routes
app.use('/api/groups', groupRoutes); 
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
