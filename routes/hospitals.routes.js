/*
  Route: /api/hospitals
*/
const { Router } = require('express');
const { check } = require('express-validator');

const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require('../controllers/hospitals.controller');
const { fieldsValidator } = require('../middleware/fields-validator');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.get('/', getHospitals);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Hospital name is mandatory').not().isEmpty(),
    fieldsValidator,
  ],
  createHospital
);

router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'Hospital name is mandatory').not().isEmpty(),
    fieldsValidator,
  ],
  updateHospital
);

router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;
