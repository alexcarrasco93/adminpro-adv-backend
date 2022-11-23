const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
  const users = await User.find({}, 'name email role google');

  res.json({
    ok: true,
    users,
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
      token
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
          msg: 'Alreaady exists an user with the provided email',
        });
      }
    }

    fields.email = email;

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
