const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const USERS = [
   {
      id: 'u1',
      name: 'Kate Dennings',
      email: 'kate.gmail.com',
      password: 'test',
   },
   {
      id: 'u2',
      name: 'GiGi Hadid',
      email: 'gigi@yahoo.com',
      password: 'test',
   },
];

const getUsers = (req, res, next) => {
   res.json({ users: USERS });
};

const login = (req, res, next) => {
   const { email, password } = req.body;
   const identifiedUser = USERS.find((u) => u.email === email);
   if (!identifiedUser || identifiedUser.password !== password) {
      throw new HttpError('could not identify user', 401);
   }
   res.json({ message: 'logged in' });
};

const signup = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Invalid Input passed', 422);
   }
   const { name, email, password } = req.body;
   const hasUser = USERS.find((u) => u.email === email);
   if (hasUser) {
      throw new HttpError('email already exists', 422);
   }
   const createdUser = {
      id: uuid(),
      name,
      email,
      password,
   };
   USERS.push(createdUser);
   res.status(201).json({ user: createdUser });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
