const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const {parseCSVAndStoreData} = require('./utils/csvParser');

const groupRoutes = require('./routes/routegroups'); 
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/auth');


require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.error(e));

const importCSV = async () => {
  const csvFilePath = './public/student.csv'; 
  parseCSVAndStoreData(csvFilePath);
};

importCSV();

// Routes
app.use('/api/groups', groupRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/users', authRoutes);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
