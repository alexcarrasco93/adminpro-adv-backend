const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/get-menu-frontend');

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
      menu: getMenuFrontend(userDb.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk with the administrator',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const userDb = await User.findOne({ email });
    let user;

    if (!userDb) {
      user = new User({
        name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      });
    } else {
      user = userDb;
      user.google = true;
    }

    // Save user
    await user.save();

    // Generate TOKEN - JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      ok: true,
      token,
      menu: getMenuFrontend(user.role),
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      msg: 'Invalid google token',
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  // Generate TOKEN - JWT
  const token = await generateJWT(uid);
  // Get User by uid
  const user = await User.findById(uid);

  res.json({
    ok: true,
    token,
    user,
    menu: getMenuFrontend(user.role),
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
