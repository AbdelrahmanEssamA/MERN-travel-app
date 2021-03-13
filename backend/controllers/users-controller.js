const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
   let users;
   try {
      users = await User.find({}, '-password');
   } catch (err) {
      const error = new HttpError(
         'Fetching users failed, please try again later.',
         500
      );
      return next(error);
   }
   res.json({
      users: users.map((user) => user.toObject({ getters: true })),
   });
};

const login = async (req, res, next) => {
   const { email, password } = req.body;

   let existingUser;

   try {
      existingUser = await User.findOne({ email: email });
   } catch (err) {
      const error = new HttpError(
         'Logging in failed, please try again later.',
         500
      );
      return next(error);
   }

   if (!existingUser || existingUser.password !== password) {
      const error = new HttpError(
         'Invalid credentials, could not log you in.',
         401
      );
      return next(error);
   }

   res.json({ message: 'Logged in!' });
};

const signup = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError('Invalid Input passed', 422));
   }

   const { name, email, password } = req.body;

   let existingUser;
   try {
      existingUser = await User.findOne({ email: email });
   } catch (err) {
      const error = new HttpError('Signing up failed try again', 500);
      return next(error);
   }
   if (existingUser) {
      const error = new HttpError('email already exists', 433);
      return next(error);
   }

   const createdUser = new User({
      name,
      email,
      image:
         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBB8ahwQS7B1cJ4ytsq37t6n9nH66Q2xXdXg&usqp=CAU',
      password,
      places: [],
   });

   try {
      await createdUser.save();
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again',
         500
      );
      return next(error);
   }

   res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
