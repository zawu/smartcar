
const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const vehicles = require('./api/vehicles/vehiclesRoutes');
var swaggerJson = require('../swagger.json'); //Following http://mherman.org/blog/2016/05/26/swagger-and-nodejs/, but was not picking up swagger comments correctly

////////////////////////////////////////////////////////////
// const swaggerJSDoc = require('swagger-jsdoc');

// swagger definition
// const swaggerDefinition = {	
//   info: {
//     title: 'Node Swagger API',
//     version: '1.0.0',
//     description: 'Demonstrating how to describe a RESTful API with Swagger',
//   },
//   host: 'localhost:3000',
//   basePath: '/',
// };


// options for the swagger docs
// const options = {
//   // import swaggerDefinition
//   swaggerDefinition: json,
//   apis: [],
//   // path to the API docs
//   // apis: ['./api/vehicles/*.js'],
// };

// // initialize swagger-jsdoc
// var swaggerSpec = swaggerJSDoc(options);

////////////////////////////////////////////////////////////

app.set('port', (process.env.PORT || 3000));

app.use(bodyparser.json()); //Use bodyparser in order to parse any post requests 
app.use(express.static(path.join(__dirname, '../public'))); //To serve swagger api at http://localhost:3000/api-docs/

app.use('/vehicles', vehicles);

// serve swagger json at http://localhost:3000/swagger.json
app.get('/swagger.json', function(req, res) { 
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerJson);
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})




module.exports = app; // for testing
