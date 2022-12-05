const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { updateImage } = require('../helpers/update-image');

const fileUpload = async (req, res = response) => {
  const { type, id } = req.params;
  const file = req.file;
  // Validate file exists
  if (!file) {
    return res.status(400).json({
      ok: false,
      msg: 'No files were uploaded',
    });
  }

  try {
    await updateImage(type, id, file.filename);
    res.json({
      ok: true,
      msg: 'File uploaded',
      fileName: file.filename,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Couldn't save it in db",
    });
  }
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
