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

const updateHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital not found',
      });
    }

    const hospitalChanges = {
      ...req.body,
      user: uid,
    };

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      hospitalChanges,
      { new: true }
    );

    res.json({
      ok: true,
      hospital: updatedHospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital not found',
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Hospital deleted correctly',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
