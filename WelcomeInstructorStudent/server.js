const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/routeGroups');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

importCSV();

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes); 

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running on port 3000);
});
