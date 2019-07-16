const mongoose = require('mongoose');

const Orders = new mongoose.Schema({
  bookId: Array,
  price: String,
  userId: String
}, { versionKey: false,  timestamps:true  });

module.exports = mongoose.model('orders', Orders );