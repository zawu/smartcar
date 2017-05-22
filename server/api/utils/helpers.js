//Require axios in order to post to the GM api
const axios = require('axios').create({
	headers: {'Content-Type': 'application/json'},
	responseType: 'json'
});


/*
	Helper function to make a post request to a given endpoint - GM in this case.
	Takes in an id, command, and responseType and posts in the format {id: string, command:string, responseType:string}
*/
exports.post = function(endpoint, id, command, responseType) {
	var payload = {
		id : id,
		command : command || "",
		responseType : responseType || "JSON"
	};
	// console.log(endpoint);
	// console.log(payload);

	return axios.post(endpoint, payload)
	// return axios.post('http://gmapi.azurewebsites.net/getVehicleInfoService', { 
	// 		"id": "1234", 
	// 		"responseType": "JSON"
	// 	})
		.then(function (response) {
			// console.log("response is", response)
			return response;
		})
		.catch(function (error) {
			console.log('axios post error', error);
			return error;
		});
};

