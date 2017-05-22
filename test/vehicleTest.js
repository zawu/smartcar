//Testing - reference - https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const server = require('../server/server.js');
const should = chai.should();
chai.use(chaiHttp);

describe('Vehicles', function() {

  var validId = 1234;
  var validId2 = 1235;
  var invalidId = 1232;

/*
  * Test the /GET:id route
  */
  describe('/GET:id Vehicle Info', function() {
      it('it should GET the vehicle info by id', function(done){
        chai.request(server)
            .get(`/vehicles/${validId}/`)
            .end(function(err, res) {
            	res.should.have.status(200);
            	const { vin, color, driveTrain, doorCount } = res.body;
            	res.body.should.be.a('object');
            	res.body.should.have.property('vin');
                res.body.should.have.property('color');
                res.body.should.have.property('driveTrain');
                res.body.should.have.property('doorCount');
                assert.equal(vin,'123123412412');
                assert.equal(color, 'Metallic Silver');
                assert.equal(driveTrain, 'v8');
                assert.equal(doorCount, 4);

              done();
            });
      });

	it('it should not GET the invalid vehicle info by id', function(done){
        chai.request(server)
            .get(`/vehicles/${invalidId}/`)
            .end(function(err, res) {
            	res.should.have.status(404);
            	res.body.message.should.equal(`Vehicle id: ${invalidId} not found.`)
              done();
            });
      });
  });

  /*
    * Test the /GET:id/doors route
    */
    describe('/GET:id/doors Security Info', function() {
        it('it should GET the vehicle security info', function(done){
          chai.request(server)
              .get(`/vehicles/${validId}/doors`)
              .end(function(err, res) {
              	res.should.have.status(200);
              	// console.log("BODY", res.body);
              	res.body.should.be.a('array');

              	res.body.forEach(function(value){
              		value.should.have.property('location');
              		value.should.have.property('locked');
              	});

                done();
              });
        });

  	it('it should not GET the invalid vehicle info by id', function(done){
          chai.request(server)
              .get(`/vehicles/${invalidId}/doors`)
              .end(function(err, res) {
              	res.should.have.status(404);
              	res.body.message.should.equal(`Vehicle id: ${invalidId} not found.`)
                done();
              });
        });
    });

    /*
      * Test the /GET:id/fuel route
      */
      describe('/GET:id/fuel Fuel Info', function() {
          it('it should GET the vehicle fuel info', function(done){
            chai.request(server)
                .get(`/vehicles/${validId}/fuel`)
                .end(function(err, res) {
                	res.should.have.status(200);
                	// console.log("BODY", res.body);
                	res.body.should.be.a('object');
                	res.body.should.have.property('percent');
                  done();
                });
          });

        it('it should GET the vehicle non-fuel info', function(done){
          chai.request(server)
              .get(`/vehicles/${validId2}/fuel`)
              .end(function(err, res) {
              	res.should.have.status(500);
              	// console.log("BODY", res.body);
              	res.body.message.should.equal(`Vehicle id: ${validId2} does not have a fuel tank.`)
                done();
              });
        });

    	it('it should not GET the invalid vehicle info by id', function(done){
            chai.request(server)
                .get(`/vehicles/${invalidId}/fuel`)
                .end(function(err, res) {
                	res.should.have.status(404);
                	res.body.message.should.equal(`Vehicle id: ${invalidId} not found.`)
                  done();
                });
          });
      });

    /*
      * Test the /GET:id/battery route
      */
      describe('/GET:id/battery battery Info', function() {
          it('it should GET the vehicle battery info', function(done){
            chai.request(server)
                .get(`/vehicles/${validId2}/battery`)
                .end(function(err, res) {
                	res.should.have.status(200);
                	// console.log("BODY", res.body);
                	res.body.should.be.a('object');
                	res.body.should.have.property('percent');
                  done();
                });
          });

        it('it should GET the vehicle non-battery info', function(done){
          chai.request(server)
              .get(`/vehicles/${validId}/battery`)
              .end(function(err, res) {
              	res.should.have.status(500);
              	// console.log("BODY", res.body);
              	res.body.message.should.equal(`Vehicle id: ${validId} does not have a battery.`)
                done();
              });
        });

    	it('it should not GET the invalid vehicle info by id', function(done){
            chai.request(server)
                .get(`/vehicles/${invalidId}/battery`)
                .end(function(err, res) {
                	res.should.have.status(404);
                	res.body.message.should.equal(`Vehicle id: ${invalidId} not found.`)
                  done();
                });
          });
      });

 	/*
      * Test the /POST:id/engine route
      */
      describe('/POST:id/engine', function() {
          it('it should POST bad vehicle battery info', function(done){
            chai.request(server)
                .post(`/vehicles/${validId}/engine`)
                .set('content-type', 'text/html')
                // .send('action')
          		.send(JSON.stringify({
		            'action': 'START'
	            }))
                .end(function(err, res) {

	            // const { message } = res.body;
	            res.should.have.status(500);
	            res.body.message.should.equal('Content-Type should be application/json');
                done();
                });
          });

          it('it should POST non-json vehicle battery info', function(done){
            chai.request(server)
                .post(`/vehicles/${validId}/engine`)
                .set('content-type', 'application/json')
                // .send('action')
          		.send(JSON.stringify({
		            'incorrect': 'START'
	            }))
                .end(function(err, res) {

	            // const { message } = res.body;
	            res.should.have.status(500);
	            res.body.message.should.equal('Action does not exist, please send json with action defined!');
                done();
                });
          });

          it('it should POST incorrect vehicle battery info', function(done){
            chai.request(server)
                .post(`/vehicles/${validId}/engine`)
                .set('content-type', 'application/json')
          		.send(JSON.stringify({
		            'action': 'wrong_action'
	            }))
          		// .expect(400)
                .end(function(err, res) {
	            // const { message } = res.body;
	            res.should.have.status(500);
	            res.body.message.should.equal('Posted action should either be START or STOP');
                done();
                });
          });

           it('it should NOT POST correct vehicle battery info', function(done){
            chai.request(server)
                .post(`/vehicles/${invalidId}/engine`)
                .set('content-type', 'application/json')
          		.send(JSON.stringify({
		            'action': 'START'
	            }))
          		// .expect(400)
                .end(function(err, res) {
	            // const { message } = res.body;
	            // res.should.have.status(200);
	            res.should.have.status(404);
	            res.body.message.should.equal(`Vehicle id: ${invalidId} not found.`);
                done();
                });
          });

          it('it should POST correct vehicle battery info', function(done){
            chai.request(server)
                .post(`/vehicles/${validId}/engine`)
                .set('content-type', 'application/json')
          		.send(JSON.stringify({
		            'action': 'START'
	            }))
          		// .expect(400)
                .end(function(err, res) {
	            // const { message } = res.body;
	            res.should.have.status(200);
                res.body.should.have.property('status');
                assert.oneOf(res.body.status,['success','error']);
                done();
                });
          });



      });
      

});