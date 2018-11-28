const mongoose = require('../mongodb');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  active: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
