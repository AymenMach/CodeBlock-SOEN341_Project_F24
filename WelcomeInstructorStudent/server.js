const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Group = require('.models/Group');
const {parseCSVAndStoreData} = require('./utils/csvParser');
const groupRoutes = require('./routes/routegroups');
const { createGroup, assignStudent } = require('./controllers/creategroup');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const importCSV = async () => {
  const csvFilePath = './public.student.csv';
  parseCSVAndStoreData(csvFilePath);
};

importCSV();

app.use('/api/groups', groupRoutes);

app.post('/api/groups/create', createGroup);
app.post('/api/groups/assign', assignStudent);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running on port 3000);
});
