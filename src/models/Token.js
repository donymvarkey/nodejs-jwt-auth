const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiry: { type: Date },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
});

tokenSchema.virtual('isExpired').get(() => {
  return Date.now() >= this.expiry;
});
tokenSchema.virtual('isActive').get(() => {
  return !this.expiry;
});

tokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

module.exports = mongoose.model('token', tokenSchema);
