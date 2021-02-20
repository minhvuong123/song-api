const mongoose = require('mongoose');
const songSchema = require('../song/song.model');
const categorySchema = require('../category/category.model');
const countrySchema = require('../country/country.model');
const playListShowSchema = require('../playListShow/playListShow.model');

const playListSchema = new mongoose.Schema({
  playList_name: {
    type: String,
    required: true
  },
  playList_slug: {
    type: String,
    required: true
  },
  playList_country: {
    type: countrySchema.schema,
    default: {}
  },
  playList_song: {
    type: [songSchema.schema],
    default: []
  },
  playList_category: {
    type: categorySchema.schema,
    default: {}
  },
  playList_listShow: {
    type: playListShowSchema.schema,
    default: {}
  },
  playList_url_image: {
    type: String
  },
  playList_view: {
    type: Number,
    default: 0
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('playList', playListSchema);