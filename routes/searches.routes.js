/*
  Route: /api/all/
*/
const { Router } = require('express');

const {
  getAll,
  getCollectionDocuments,
} = require('../controllers/searches.controller');
const { fieldsValidator } = require('../middleware/fields-validator');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.get('/:search', validateJWT, getAll);
router.get('/collection/:table/:search', validateJWT, getCollectionDocuments);

module.exports = router;
