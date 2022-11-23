const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verify email
    const userDb = await User.findOne({ email });

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'Email not found',
      });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, userDb.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    // Generate TOKEN - JWT
    const token = await generateJWT(userDb.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

module.exports = {
  login,
};
