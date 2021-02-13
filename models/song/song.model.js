const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  song_name: {
    type: String,
    required: true
  },
  song_singer: {
    type: String,
    required: true
  },
  song_url: {
    type: String,
    required: true
  },
  song_id_playlist: {
    type: String,
    default: ''
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('song', songSchema);