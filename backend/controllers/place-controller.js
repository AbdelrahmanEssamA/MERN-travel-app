const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../utils/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
   {
      id: 'p1',
      title: 'La Sagrada Familia',
      image:
         'https://images.adsttc.com/media/images/5cff/5ec5/284d/d16d/6a00/1111/large_jpg/1.jpg?1560239805',
      address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
      location: { lat: 41.4030154, lng: 2.1729796 },
      creator: 'u1',
      description:
         'The Basílica de la Sagrada Família, is a large unfinished Roman Catholic minor basilica in the Eixample district of Barcelona, Catalonia, Spain',
   },
   {
      id: 'p2',
      title: 'Adams Lookout',
      image:
         'http://www.workthere.com/media/773567/kantoorruimte-huren-amsterdam-adam-tower-6.jpg',
      address: 'Overhoeksplein 5, 1031 KS Amsterdam, Netherlands',
      location: { lat: 52.383863, lng: 4.900161 },
      creator: 'u1',
      description:
         'Elevator with a light show to a 20-story rooftop with a restaurant/bar & an over-the-edge swing.',
   },
];

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
   let places;
   try {
      places = await Place.find({ creator: userId });
   } catch (err) {
      const error = new HttpError('Opps Fetching places failed.', 500);
      return next(error);
   }

   if (!places || places.length === 0) {
      throw new HttpError(
         'could not find a place for the provided  user id',
         404
      );
   }

   res.json({
      places: places.map((place) => place.toObject({ getters: true })),
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
      image:
         'http://www.workthere.com/media/773567/kantoorruimte-huren-amsterdam-adam-tower-6.jpg',
      creator,
   });
   try {
      await createdPlace.save();
   } catch (err) {
      const error = new HttpError(
         'creating place failed, please try again',
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
      throw new HttpError('Invalid Input passed', 422);
   }

   const { title, description } = req.body;
   const placeId = req.params.pid;

   let place;
   try {
      place = await Place.findById(placeId);
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not update place  1',
         500
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
      place = await Place.findById(placeId);
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not delete place',
         500
      );
      return next(error);
   }
   try {
      await place.remove();
   } catch (err) {
      const error = new HttpError(
         'Something went wrong,could not delete place',
         500
      );
      return next(error);
   }
   res.json({ message: 'Place Deleted' });
};

exports.getPlacesByUserID = getPlacesByUserID;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
