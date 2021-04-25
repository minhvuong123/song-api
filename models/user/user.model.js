const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: {
    type: String
  },
  user_avatar: {
    type: String
  },
  user_email: {
    type: String,
    required: true
  },
  user_phone: {
    type: String
  },
  user_password: {
    type: String,
    required: true
  },
  user_role: {
    type: String,
    default: 'normal'
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('user', userSchema);