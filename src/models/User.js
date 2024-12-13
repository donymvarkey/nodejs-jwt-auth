const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/utils');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('user', userSchema);
