const mongoose = require('mongoose');
const countrySchema = require('../country/country.model');
const singerSchema = require('../singer/singer.model');

const songSchema = new mongoose.Schema({
  song_name: {
    type: String
  },
  song_country: {
    type: String,
    default: ''
  },
  song_singer: {
    type: [singerSchema.schema],
    default: []
  },
  song_url_image: {
    type: String
  },
  song_url_music: {
    type: String
  },
  song_view: {
    type: Number,
    default: 0
  },
  song_id_albums: {
    type: String,
    default: ''
  },
  song_duration: {
    type: Number,
    default: 0
  },
  song_user_id: {
    type: String,
    default: ''
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('song', songSchema);