const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { updateImage } = require('../helpers/update-image');

const fileUpload = (req, res = response) => {
  const { type, id } = req.params;

  const validTypes = ['hospitals', 'doctors', 'users'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: 'Not a valid type (user/hospital/doctor)',
    });
  }

  // Validate file exists
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No files were uploaded',
    });
  }

  // Manage the image
  const file = req.files.image;

  const arrayName = file.name.split('.'); // wolvering.1.3.jpg
  const fileExtension = arrayName[arrayName.length - 1];

  // Validate extension
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      ok: false,
      msg: 'Not allowed extension',
    });
  }

  // Generate file name
  const fileName = `${uuidv4()}.${fileExtension}`;

  // Path where to save the image
  const path = `./uploads/${type}/${fileName}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: 'Error while moving the image',
      });
    }

    // Update database
    updateImage(type, id, fileName);

    res.json({
      ok: true,
      msg: 'File uploaded',
      fileName,
    });
  });
};

const getImage = (req, res = response) => {
  const { type, image } = req.params;

  let pathImg = path.join(__dirname, `../uploads/${type}/${image}`);

  // default image
  if (!fs.existsSync(pathImg)) {
    pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
  }
  res.sendFile(pathImg);
};

module.exports = {
  fileUpload,
  getImage,
};
