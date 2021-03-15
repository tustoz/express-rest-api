// import mongoose module
const mongoose = require('mongoose')

// create new mongoose models
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

// export models
module.exports = mongoose.model('User', userSchema)