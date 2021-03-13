const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nohp: {
    type: Number,
    required: true
  },
  jurusan: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)