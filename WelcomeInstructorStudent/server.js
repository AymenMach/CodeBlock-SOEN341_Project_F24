const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Group = require('.models/Group');
const {parseCSVAndStoreData} = require('./utils/csvParser');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const importCSV = async () => {
  const fs = require('fs');
  const csv = fs.readFileSync('./public/student.csv', 'utf8');
  parseCSVAndStoreData(csv);
};

importCSV();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running on port 3000);
});
