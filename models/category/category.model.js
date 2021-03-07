const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('category', categorySchema);