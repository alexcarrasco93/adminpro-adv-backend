const { response } = require('express');

const Hospital = require('../models/hospital.model');

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate('user', 'name img');
  res.json({
    ok: true,
    hospitals,
  });
};

const createHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ ...req.body, user: uid });

  try {
    const hospitalDb = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDb,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

const updateHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'updateHospitals',
  });
};

const deleteHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'deleteHospitals',
  });
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
