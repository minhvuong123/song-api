const mongoose = require('mongoose');

const singerSchema = new mongoose.Schema({
  singer_name: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('singer', singerSchema);