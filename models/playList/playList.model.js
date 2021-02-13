const mongoose = require('mongoose');

const playListSchema = new mongoose.Schema({
  playList_name: {
    type: String,
    required: true
  },
  playList_type: { // hiphop, tetXuan, rap, ...
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('playList', playListSchema);