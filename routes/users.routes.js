/*
  Route: /api/users
*/
const { Router } = require('express');
const { check } = require('express-validator');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');
const { fieldsValidator } = require('../middleware/fields-validator');
const { validateJWT, validateAdmiRole, validateAdmiRoleOrSameUser } = require('../middleware/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);

router.post(
  '/',
  [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('password', 'Password is mandatory').not().isEmpty(),
    check('email', 'Email is mandatory').isEmail(),
    fieldsValidator,
  ],
  createUser
);

router.put(
  '/:id',
  [
    validateJWT,
    validateAdmiRoleOrSameUser,
    check('name', 'Name is mandatory').not().isEmpty(),
    check('email', 'Email is mandatory').isEmail(),
    check('role', 'Role is mandatory').not().isEmpty(),
    fieldsValidator,
  ],
  updateUser
);

router.delete('/:id', [validateJWT, validateAdmiRole], deleteUser);

module.exports = router;
