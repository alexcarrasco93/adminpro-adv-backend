const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log('BD Online');
  } catch (error) {
    console.log(error);
    throw new Error('Error initializating the BD, see logs');
  }
};

module.exports = {
  dbConnection,
};
