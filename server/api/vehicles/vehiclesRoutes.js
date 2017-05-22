
const app = require('express');
const router = app.Router();

const apicache = require ('apicache'); //For caching vehicle info for 10 minutes
const cache = apicache.middleware;

const onlyStatus200 = function(req){req.statusCode === 200};
const cacheSuccesses = cache('10 minutes', onlyStatus200); //Caches only if status is 200


const vehicles = require('./vehiclesController');

// console.log("In Vehicle Routes");

//Vehicle Info
router.route('/:id')
	.get(cacheSuccesses, vehicles.getVehicleInfo);  

//Security
router.route('/:id/doors')
	.get(vehicles.getSecurity);
	// .get(cache('10 minutes'), vehicles.getSecurity);

//Fuel Range
router.route('/:id/fuel')
	.get(vehicles.getFuelRange);
	// .get(cache('10 minutes'), vehicles.getFuelRange);

//Battery Range
router.route('/:id/battery')
	.get(vehicles.getBatteryRange);
	// .get(cache('10 minutes'), vehicles.getBatteryRange);

//Start/Stop Engine
router.route('/:id/engine')
	.post(vehicles.postEngine);


module.exports = router;