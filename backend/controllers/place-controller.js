const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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
      creator: 'u2',
      description:
         'Elevator with a light show to a 20-story rooftop with a restaurant/bar & an over-the-edge swing.',
   },
];

const getPlaceById = (req, res, next) => {
   const placeId = req.params.pid;
   const place = DUMMY_PLACES.find((p) => {
      return p.id === placeId;
   });

   if (!place) {
      throw new HttpError('could not find a place for the provided id', 404);
   }

   res.json({ place });
};

const getPlaceByUserID = (req, res, next) => {
   const userId = req.params.uid;
   const place = DUMMY_PLACES.find((p) => {
      return p.creator === userId;
   });

   if (!place) {
      throw new HttpError(
         'could not find a place for the provided  user id',
         404
      );
   }

   res.json({ place });
};

const createPlace = (req, res, next) => {
   const { title, description, coordinates, address, creator } = req.body;
   const createdPlace = {
      id: uuid(),
      title,
      description,
      location: coordinates,
      address,
      creator,
   };
   DUMMY_PLACES.push(createdPlace);
   res.status(201).json({ place: createdPlace });
};

exports.getPlaceByUserID = getPlaceByUserID;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
