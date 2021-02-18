const mongoose = require('mongoose');

const playListShowSchema = new mongoose.Schema({
  playListShow_name: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('playListShow', playListShowSchema);