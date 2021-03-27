// import mongoose module
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// create new mongoose models
const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nohp: {
    type: Number,
    required: true,
  },
  jurusan: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// hash user password before saving into database
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// export models
module.exports = mongoose.model("User", userSchema);
