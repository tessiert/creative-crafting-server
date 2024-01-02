const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: '',
    required: true
  },
  lastname: {
    type: String,
    default: '',
    required: true
  },
  email: {
    type: String,
    default: '',
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: '',
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;