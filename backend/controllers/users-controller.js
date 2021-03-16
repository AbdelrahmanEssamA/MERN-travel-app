const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fileUpload = require('../middleware/file-upload');
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

   if (!existingUser) {
      const error = new HttpError(
         'Invalid credentials, could not log you in.',
         403
      );
      return next(error);
   }

   let isValidPassword = false;

   try {
      isValidPassword = await bcrypt.compare(
         password,
         existingUser.password
      );
   } catch (err) {
      const error = new HttpError(
         'Logging in failed, please try again later.',
         500
      );
      return next(error);
   }

   if (!isValidPassword) {
      const error = new HttpError(
         'Logging in failed, please try again later.',
         500
      );
      return next(error);
   }

   let token;
   try {
      token = jwt.sign(
         {
            userId: existingUser.id,
            email: existingUser.email,
         },
         'asdfg12345',
         {
            expiresIn: '1h',
         }
      );
   } catch (err) {
      const error = new HttpError(
         'logging up failed, please try again',
         500
      );
   }

   res.json({
      message: 'Logged in!',
      userID: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      token: token,
   });
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
      const error = new HttpError('email already exists', 422);
      return next(error);
   }

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(password, 12);
   } catch (error) {
      return next(new HttpError('could not create user', 500));
   }
   const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
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

   let token;
   try {
      token = jwt.sign(
         {
            userId: createdUser.id,
            email: createdUser.email,
         },
         'asdfg12345',
         {
            expiresIn: '1h',
         }
      );
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again',
         500
      );
   }
   res.status(201).json({
      userID: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      token: token,
   });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
