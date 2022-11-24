const fs = require('fs');

const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

const deletePreviousImage = (path) => {
  if (fs.existsSync(path)) {
    // delete old image
    fs.unlinkSync(path);
  }
};

const updateImage = async (type, id, fileName) => {
  let oldPath = '';
  switch (type) {
    case 'doctors':
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        console.log('No doctor found with the provided id');
        return false;
      }

      oldPath = `./uploads/doctors/${doctor.img}`;
      deletePreviousImage(oldPath);

      doctor.img = fileName;
      await doctor.save();

      return true;
    case 'hospitals':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log('No hospital found with the provided id');
        return false;
      }

      oldPath = `./uploads/hospitals/${hospital.img}`;
      deletePreviousImage(oldPath);

      hospital.img = fileName;
      await hospital.save();

      return true;
    case 'users':
      const user = await User.findById(id);
      if (!user) {
        console.log('No user found with the provided id');
        return false;
      }

      oldPath = `./uploads/users/${user.img}`;
      deletePreviousImage(oldPath);

      user.img = fileName;
      await user.save();

      return true;

    default:
      return false;
  }
};

module.exports = {
  updateImage,
};
