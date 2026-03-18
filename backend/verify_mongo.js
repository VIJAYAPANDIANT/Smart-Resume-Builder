const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGODB_URI.substring(0, 50) + '...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: MongoDB Connected');
    setTimeout(() => {
      console.log('Still connected, exiting test...');
      process.exit(0);
    }, 5000);
  })
  .catch(err => {
    console.error('FAILURE: MongoDB connection error:', err);
    process.exit(1);
  });
