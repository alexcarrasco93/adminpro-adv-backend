const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const validateJWT = (req = request, res = response, next) => {
  // Read token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No token found in the request',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
    });
  }
};

const validateAdmiRole = async (req, res = response, next) => {
  const uid = req.uid;
  try {
    const userDb = await User.findById(uid);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No user found',
      });
    }

    if (userDb.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: 'Not authorised',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk to the administrator',
    });
  }
};

const validateAdmiRoleOrSameUser = async (req, res = response, next) => {
  const uid = req.uid;
  const id = req.params.id;
  try {
    const userDb = await User.findById(uid);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No user found',
      });
    }

    if (userDb.role === 'ADMIN_ROLE' || uid === id) {
      next();
      return;
    }
    return res.status(403).json({
      ok: false,
      msg: 'Not authorised',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk to the administrator',
    });
  }
};

module.exports = {
  validateJWT,
  validateAdmiRole,
  validateAdmiRoleOrSameUser,
};
