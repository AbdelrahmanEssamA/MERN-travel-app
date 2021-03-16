const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fileUpload = require('../middleware/file-upload');
const fs = require('fs');
const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
   const placeId = req.params.pid;
   let place;
   try {
      place = await Place.findById(placeId);
   } catch (err) {
      const error = new HttpError('Opps could not find a place.', 500);
      return next(error);
   }

   if (!place) {
      const error = new HttpError(
         'could not find a place for the provided id',
         404
      );
      return next(error);
   }

   res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserID = async (req, res, next) => {
   const userId = req.params.uid;

   let userWithPlaces;
   try {
      userWithPlaces = await User.findById(userId).populate('places');
   } catch (err) {
      const error = new HttpError('Opps Fetching places failed.', 500);
      return next(error);
   }

   if (!userWithPlaces || userWithPlaces.places.length === 0) {
      throw new HttpError(
         'could not find a place for the provided  user id',
         404
      );
   }

   res.json({
      places: userWithPlaces.places.map((place) =>
         place.toObject({ getters: true })
      ),
   });
};

const createPlace = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      next(new HttpError('Invalid Input passed', 422));
   }
   const { title, description, address, creator } = req.body;

   let coordinates;
   try {
      coordinates = await getCoordsFromAddress(address);
   } catch (err) {
      return next(err);
   }

   const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: req.file.path,
      creator,
   });
   console.log(creator);
   let user;
   try {
      user = await User.findById(creator);
   } catch (err) {
      return next(
         new HttpError('creating place failed please try again', 500)
      );
   }

   if (!user) {
      return next(
         new HttpError('could not find user with provided id', 500)
      );
   }

   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({ session: sess });
      user.places.push(createdPlace);
      await user.save({ session: sess });
      await sess.commitTransaction();
   } catch (err) {
      const error = new HttpError(
         'creating place failed, please try again2',
         500
      );
      return next(error);
   }
   res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError('Invalid Input passed', 422));
   }

   const { title, description } = req.body;
   const placeId = req.params.pid;

   let place;
   try {
      place = await Place.findById(placeId);
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not update place',
         500
      );
      return next(error);
   }

   if (place.creator != req.userData.userId) {
      const error = new HttpError(
         'You are not allowed update this place',
         401
      );
      return next(error);
   }
   place.title = title;
   place.description = description;

   try {
      await place.save();
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not update place 2',
         500
      );
      return next(error);
   }

   res.json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
   const placeId = req.params.pid;
   let place;

   try {
      place = await Place.findById(placeId).populate('creator');
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not delete place',
         500
      );
      return next(error);
   }

   if (!place) {
      const error = new HttpError(
         'Could not find place with provided id',
         404
      );
      return next(error);
   }
   console.log(place);

   console.log(req.userData.userId);
   if (place.creator.id != req.userData.userId) {
      const error = new HttpError(
         'You are not allowed delete this place',
         401
      );
      return next(error);
   }
   const imagePath = place.image;
   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await place.remove({ session: sess });
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });
      await sess.commitTransaction();
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not delete place',
         500
      );
      return next(error);
   }
   fs.unlink(imagePath, (err) => {
      console.log(err);
   });
   res.json({ message: 'Place Deleted' });
};

exports.getPlacesByUserID = getPlacesByUserID;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
