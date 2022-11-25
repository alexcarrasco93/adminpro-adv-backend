/*
  Route: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { fieldsValidator } = require('../middleware/fields-validator');

const router = Router();

router.post(
  '/',
  [
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    fieldsValidator,
  ],
  login
);

router.post(
  '/google',
  [check('token', 'Google token is mandatory').not().isEmpty(), fieldsValidator],
  googleSignIn
);

module.exports = router;
