const mongoose = require('mongoose');

const albumListSchema = new mongoose.Schema({
  albumList_name: {
    type: String
  },
  albumList_slug: {
    type: String
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('albumList', albumListSchema);