const { Schema, model } = require('mongoose');

const DoctorScheme = Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
});

DoctorScheme.method('toJSON', function () {
  const { __v, password, ...object } = this.toObject();
  return object;
});

module.exports = model('Doctor', DoctorScheme);
