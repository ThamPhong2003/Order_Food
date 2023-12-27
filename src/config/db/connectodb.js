const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/order');
    console.log('succes connect to db');
  } catch (error) {
    console.log('fail');
  }
}

module.exports = {
  connect,
};
