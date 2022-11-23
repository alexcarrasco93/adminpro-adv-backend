require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Create the express server
const app = express();

// CORS configuration
app.use(cors());

// Reading and parsing of the body
app.use(express.json());

// Database
dbConnection();

// Routes
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/login', require('./routes/auth.routes'));

app.listen(process.env.PORT, () => {
  console.log('Server running on port ' + process.env.PORT);
});
