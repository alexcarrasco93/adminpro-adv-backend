const { Schema, model } = require('mongoose');

const HospitalScheme = Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

HospitalScheme.method('toJSON', function () {
  const { __v, password, ...object } = this.toObject();
  return object;
});

module.exports = model('Hospital', HospitalScheme);
