const mongoose = require('mongoose');
const songSchema = require('../song/song.model');

const playListSchema = new mongoose.Schema({
  playList_name: {
    type: String,
    required: true
  },
  playList_song: {
    type: [songSchema.schema],
    default: []
  },
  playList_type: { // hiphop, tetXuan, rap, ...
    type: String
  },
  playList_url_image: {
    type: String
  },
  playList_country: {
    type: String
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('playList', playListSchema);