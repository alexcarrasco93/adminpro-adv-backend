const { response } = require('express');

const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate('user', 'name img')
    .populate('hospital', 'name img');
  res.json({
    ok: true,
    doctors,
  });
};

const createDoctor = async (req, res = response) => {
  const uid = req.uid;
  const doctor = new Doctor({ ...req.body, user: uid });
  const hospitalDb = await Hospital.findById(doctor.hospital);

  if (!hospitalDb) {
    return res.status(404).json({
      ok: false,
      msg: 'No hospital founded',
    });
  }

  try {
    const doctorDb = await doctor.save();

    res.json({
      ok: true,
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

const updateDoctor = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'updateDoctors',
  });
};

const deleteDoctor = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'deleteDoctors',
  });
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
