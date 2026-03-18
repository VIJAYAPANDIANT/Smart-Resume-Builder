const mongoose = require('mongoose');

async function testConnection() {
  console.log('Attempting to connect to MongoDB at localhost:27017...');
  try {
    await mongoose.connect('mongodb://localhost:27017/test', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('SUCCESS: Connected to MongoDB!');
  } catch (err) {
    console.log('FAILURE: Could not connect to MongoDB.');
    console.log('Error Code:', err.code);
    console.log('Error Message:', err.message);
  } finally {
    process.exit();
  }
}

testConnection();
