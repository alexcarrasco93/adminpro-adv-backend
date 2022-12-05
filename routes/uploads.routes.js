/*
  Route: /api/uploads/
*/
const { Router } = require('express');

const { fileUpload, getImage } = require('../controllers/uploads.controller');
const { uploadMulter } = require('../middleware/file-manager');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.put(
  '/:type/:id',
  [validateJWT, uploadMulter.single('image')],
  fileUpload
);
router.get('/:type/:image', validateJWT, getImage);

module.exports = router;
