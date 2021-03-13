const express = require('express');

const placesControllers = require('../controllers/place-controller');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);
router.get('/user/:uid', placesControllers.getPlaceByUserID);
router.post('/', placesControllers.createPlace);

module.exports = router;
