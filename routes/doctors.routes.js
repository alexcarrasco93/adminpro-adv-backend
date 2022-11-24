/*
  Route: /api/doctors
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctors.controller.js');
const { fieldsValidator } = require('../middleware/fields-validator');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.get('/', getDoctors);

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
  [],
  updateDoctor
);

router.delete('/:id', validateJWT, deleteDoctor);

module.exports = router;
