const { response } = require('express');

const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

const getAll = async (req, res = response) => {
  const search = req.params.search;
  const searchRegex = new RegExp(search, 'i');

  const usersPromise = User.find({ name: searchRegex });
  const hospitalsPromise = Hospital.find({ name: searchRegex });
  const doctorsPromise = Doctor.find({ name: searchRegex });

  const [users, hospitals, doctors] = await Promise.all([
    usersPromise,
    hospitalsPromise,
    doctorsPromise,
  ]);

  res.json({
    ok: true,
    users,
    hospitals,
    doctors,
  });
};

const getCollectionDocuments = async (req, res = response) => {
  const table = req.params.table;
  const search = req.params.search;
  const searchRegex = new RegExp(search, 'i');

  let data = [];

  switch (table) {
    case 'doctors':
      data = await Doctor.find({ name: searchRegex })
        .populate('user', 'name img')
        .populate('hospital', 'name img');
      break;
    case 'hospitals':
      data = await Hospital.find({ name: searchRegex }).populate('user', 'name img');
      break;
    case 'users':
      data = await User.find({ name: searchRegex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: 'Table not found',
      });
  }

  res.json({
    ok: true,
    results: data,
  });
};

module.exports = {
  getAll,
  getCollectionDocuments,
};
