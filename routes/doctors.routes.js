/*
  Route: /api/doctors
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { getDoctors, createDoctor, updateDoctor, deleteDoctor, getDoctorById } = require('../controllers/doctors.controller.js');
const { fieldsValidator } = require('../middleware/fields-validator');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.get('/', validateJWT, getDoctors);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Doctor name is mandatory').not().isEmpty(),
    check('hospital', 'Hospital id must be valid').isMongoId(),
    fieldsValidator
  ],
  createDoctor
);

router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'Doctor name is mandatory').not().isEmpty(),
    check('hospital', 'Hospital id must be valid').isMongoId(),
    fieldsValidator
  ],
  updateDoctor
);

router.delete('/:id', validateJWT, deleteDoctor);

router.get('/:id', validateJWT, getDoctorById);

module.exports = router;
