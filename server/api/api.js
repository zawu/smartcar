const router = require('express').Router();

const vehicles = require('./vehicles/vehiclesRoutes');

router.use('/vehicles', vehicles);

module.exports = router;