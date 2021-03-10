const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  country_name: {
    type: String
  },
  country_slug: {
    type: String
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('country', countrySchema);