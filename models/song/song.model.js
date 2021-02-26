const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const countrySchema = require('../country/country.model');
const singerSchema = require('../singer/singer.model');

const songSchema = new mongoose.Schema({
  song_name: {
    type: String,
    required: true
  },
  song_country: {
    type: countrySchema.schema,
    default: {}
  },
  song_singer: {
    type: [singerSchema.schema],
    required: true,
    default: []
  },
  song_url_image: {
    type: String,
    required: true
  },
  song_url_music: {
    type: String,
    required: true
  },
  song_view: {
    type: Number,
    default: 0
  },
  song_id_playlist: {
    type: String,
    default: ''
  },
  song_duration: {
    type: Decimal128,
    default: 0
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('song', songSchema);