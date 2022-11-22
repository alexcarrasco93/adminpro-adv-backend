require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Create the express server
const app = express();

// CORS configuration
app.use(cors())

// Database
dbConnection();

console.log(process.env);

// Routes
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Helloo world',
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server running on port ' + process.env.PORT);
});
