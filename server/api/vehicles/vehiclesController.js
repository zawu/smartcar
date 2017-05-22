//Holds the 
const helpers = require('../utils/helpers.js');
const config = require('../../config.js');

const apicache = require ('apicache');

const parse = require('parse-headers');

const cache = apicache.middleware;


//GM API Endpoints
const vehicleInfoEndpoint = config.gmApi + "/getVehicleInfoService";
const securityStatusEndpoint = config.gmApi + "/getSecurityStatusService";
const energyEndpoint = config.gmApi + "/getEnergyService";
const engineEndpoint = config.gmApi + "/actionEngineService";

//Vehicles
exports.getVehicleInfo = function(req, res) {

	// console.log(req.params.id);
	helpers.post(vehicleInfoEndpoint,req.params.id)
		.then(function(response){
			var gmVehicleInfo = response.data;

			if(gmVehicleInfo.status !=200){
				res.status(gmVehicleInfo.status).json({status:gmVehicleInfo.status, message: gmVehicleInfo.reason });
			}else{
				// console.log("RETURN STATUS", gmVehicleInfo.status);

				//Create vehiceInfo object
				var vehicleInfo = new Object();
				vehicleInfo.vin = gmVehicleInfo.data.vin.value;
				vehicleInfo.color = gmVehicleInfo.data.color.value;
				vehicleInfo.driveTrain = gmVehicleInfo.data.driveTrain.value;

				if(gmVehicleInfo.data.fourDoorSedan.value === "True"){
					vehicleInfo.doorCount = 4;
				}else{
					vehicleInfo.doorCount = 2;
				}

				// res.send(JSON.stringify(vehicleInfo));
				res.json(vehicleInfo);
			}
		})
		.catch(function(error){
			console.log('Post Error: ' + res.reason);
			res.status(error.status).json(error);
		});
};

//
exports.getSecurity = function(req, res) {
	helpers.post(securityStatusEndpoint,req.params.id)
		.then(function(response){
			// console.log("IN SECURITY");
			var gmSecurityInfo = response.data;

			if(gmSecurityInfo.status !=200){
				// console.log("SECURITY ERROR IS", gmSecurityInfo.status);
				res.status(gmSecurityInfo.status).json({status:gmSecurityInfo.status, message: gmSecurityInfo.reason });
			}else{
				//Create security object 
				var security = [];
				for(var door of gmSecurityInfo.data.doors.values){
					// console.log("pushing door", door);
					security.push({
						'location' : door.location.value,
						'locked' : door.locked.value === 'True'
					});
				}

				// res.send(JSON.stringify(security));
				res.json(security);
			}
		})
		.catch(function(error){
			console.log('Post Error: ' + res.reason);
			res.status(error.status).json(error);
		});

};


exports.getFuelRange = function(req, res) {
	// console.log(req.params.id);
	helpers.post(energyEndpoint,req.params.id)
		.then(function(response){

			// console.log("IN FUEL");
			var gmEnergyInfo = response.data;

			if(gmEnergyInfo.status !=200){
				res.status(gmEnergyInfo.status).json({status:gmEnergyInfo.status, message: gmEnergyInfo.reason });
			}else{
				var fuelLevel = gmEnergyInfo.data.tankLevel.value;
				
				if(fuelLevel === 'null'){
					res.status(500).json({status:500, message:`Vehicle id: ${req.params.id} does not have a fuel tank.`});
				}else{
					res.json({
						'percent': JSON.parse(fuelLevel)
					});
				}
			}
		})
		.catch(function(error){
			console.log('Post Error: ' + res.reason);
			res.status(error.status).json(error);
		});

};



exports.getBatteryRange = function(req, res) {
	// console.log(req.params.id);
	helpers.post(energyEndpoint,req.params.id)
		.then(function(response){
			// console.log("IN battery");

			var gmEnergyInfo = response.data;

			if(gmEnergyInfo.status !=200){
				res.status(gmEnergyInfo.status).json({status:gmEnergyInfo.status, message: gmEnergyInfo.reason });
			}else{
				var batteryLevel = gmEnergyInfo.data.batteryLevel.value;

				if(batteryLevel === 'null'){
					// console.log("BATTERY NULL ${req.params.id} ");
					res.status(500).json({status:500, message:`Vehicle id: ${req.params.id} does not have a battery.`});
				}else{
					res.json({
						'percent': JSON.parse(batteryLevel)
					});
				}
			}
		})
		.catch(function(error){
			console.log('Post Error: ' + res.reason);
			res.status(error.status).json(error);
		});

};

exports.postEngine = function(req, res) {

	if(req.headers['content-type'] != 'application/json'){
		return res.status(500).json({status:500, message:`Content-Type should be application/json`});
	}

	var action = req.body.action;

	// console.log("ACTION",action);

	// if(!action || action.indexOf('application/json') != 0){
	if(!action){
		// console.log("POST THERE WAS AN ERROR");
		return res.status(500).json({status:500, message:`Action does not exist, please send json with action defined!`});
	}

	if(action === 'START'){
		gmAction = 'START_VEHICLE';
	}else if (action === 'STOP'){
		gmAction = 'STOP_VEHICLE';
	}else{
		return res.status(500).json({status:500, message:`Posted action should either be START or STOP`});
	}

	helpers.post(engineEndpoint,req.params.id, gmAction)
		.then(function(response){
			// console.log("HI ",response.data.status);
			if(response.data.status !=200){
				return res.status(response.data.status).json({status:response.data.status, message:response.data.reason});
			}else{

				// console.log("IN Engine");

				var gmEngineStatus = response.data.actionResult.status;
				var transform = new Object;

				if( gmEngineStatus === 'EXECUTED' ){
					transform.status = 'success';
				}else{
					transform.status = 'error';
				}

				// res.send(JSON.stringify(transform));
				res.json(transform);
			}

		})
		.catch(function(error){
			console.log('Post Error: ' + res.reason);
			res.status(error.status).json(error);
		});

};