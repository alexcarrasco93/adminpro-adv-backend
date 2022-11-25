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

const updateDoctor = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: 'Doctor not found',
      });
    }

    const doctorChanges = {
      ...req.body,
      user: uid,
    };

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorChanges, {
      new: true,
    });

    res.json({
      ok: true,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: 'Doctor not found',
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Doctor deleted correctly',
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
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
