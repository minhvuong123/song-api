const mongoose = require('mongoose');

const albumListSchema = new mongoose.Schema({
  albumList_name: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('albumList', albumListSchema);