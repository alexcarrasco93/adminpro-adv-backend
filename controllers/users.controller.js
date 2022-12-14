const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { getMenuFrontend } = require('../helpers/get-menu-frontend');

const getUsers = async (req, res) => {
  const from = Number(req.query.from) || 0;

  const usersPromise = User.find({}, 'name email img role google')
    .skip(from)
    .limit(5);

  const totalPromise = User.countDocuments();

  const [users, total] = await Promise.all([usersPromise, totalPromise]);

  res.json({
    ok: true,
    users,
    total,
  });
};

const createUser = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'The email is already registered',
      });
    }
    const user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user to db
    await user.save();

    // Generate TOKEN - JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
      menu: getMenuFrontend(user.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error... check the logs',
    });
  }
};

const updateUser = async (req, res = response) => {
  // TODO: Validate token and check is the correct user

  const uid = req.params.id;

  try {
    const userDb = await User.findById(uid);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No existing user with the provided id',
      });
    }

    // Updates
    const { password, google, email, ...fields } = req.body;

    if (userDb.email !== email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Already exists an user with the provided email',
        });
      }
    }

    if (!userDb.google) {
      fields.email = email;
    } else if (userDb.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'Google users cannot change their emails',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error',
    });
  }
};

const deleteUser = async (req, res = response) => {
  // TODO: Validate token and check is the correct user

  const uid = req.params.id;

  try {
    const userDb = await User.findById(uid);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No existing user with the provided id',
      });
    }

    await User.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'User deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error',
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
