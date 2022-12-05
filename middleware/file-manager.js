const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params;
    cb(null, `uploads/${type}`);
  },
  filename: (req, file, cb) => {
    const arrayName = file.originalname.split('.'); // wolvering.1.3.jpg
    const fileExtension = arrayName[arrayName.length - 1];
    // Generate file name
    const fileName = `${uuidv4()}.${fileExtension}`;
    cb(null, fileName);
  },
});

const multerFilter = (req, file, cb) => {
  const arrayName = file.originalname.split('.'); // wolvering.1.3.jpg
  const fileExtension = arrayName[arrayName.length - 1];
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    cb(new Error('File extension not accepted'));
  } else {
    cb(null, true);
  }
};

const uploadMulter = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'uploads/' });

module.exports = {
  uploadMulter,
};
