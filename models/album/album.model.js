const mongoose = require('mongoose');
const songSchema = require('../song/song.model');
const categorySchema = require('../category/category.model');
const countrySchema = require('../country/country.model');
const albumListSchema = require('../albumList/albumList.model');

const albumSchema = new mongoose.Schema({
  album_name: {
    type: String,
    required: true
  },
  album_slug: {
    type: String,
    required: true
  },
  album_country: {
    type: countrySchema.schema,
    default: {}
  },
  album_song: {
    type: [songSchema.schema],
    default: []
  },
  album_category: {
    type: categorySchema.schema,
    default: {}
  },
  album_listShow: {
    type: albumListSchema.schema,
    default: {}
  },
  album_url_image: {
    type: String,
    default: ''
  },
  album_view: {
    type: Number,
    default: 0
  },
  album_user_id: {
    type: String,
    default: ''
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('album', albumSchema);