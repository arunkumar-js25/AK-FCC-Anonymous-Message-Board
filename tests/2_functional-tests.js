const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);  
		test('Creating a new thread', function (done) {
			  chai
				.request(server)
				.post('/api/threads/functest') 
				.send({  text: 'fcc_test_Wed Nov 30 2022 16:29:59 GMT+0530 (India Standard Time)',  delete_password: 'delete_me' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Viewing the 10 most recent threads with 3 replies each', function (done) {
		  chai
			.request(server)
			.get('/api/threads/functest')
			.end(function (err, res) {
			  assert.equal(res.status, 200);
			  done();
			});
		});

  test('Deleting a thread with the incorrect password', function (done) {
			  chai
				.request(server)
				.delete('/api/threads/fcc_test') 
				.send({  thread_id: '638732feaa22b4647986bfdb',  delete_password: 'delete' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Deleting a thread with the correct password', function (done) {
			  chai
				.request(server)
				.delete('/api/threads/fcc_test') 
				.send({  thread_id: '638732feaa22b4647986bfdb',  delete_password: 'delete' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Reporting a thread', function (done) {
			  chai
				.request(server)
				.put('/api/threads/general') 
				.send({  thread_id: '638732feaa22b4647986bfdb'})
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Creating a new reply', function (done) {
			  chai
				.request(server)
				.post('/api/replies/fcc_test') 
				.send({  thread_id: '638737cc4a9de5bcec2b0fe6',
               text: 'fcc_test_reply',
               delete_password: 'delete_me' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Viewing a single thread with all replies', function (done) {
			  chai
				.request(server)
				.get('/api/replies/fcc_test')
        .query({thread_id:'638737cc4a9de5bcec2b0fe6'}) 
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Deleting a reply with the incorrect password', function (done) {
			  chai
				.request(server)
				.delete('/api/replies/fcc_test') 
				.send({  thread_id: '638737cc4a9de5bcec2b0fe6',
               reply_id:'638733afaa22b4647986bffc',
               delete_password: 'dele' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Deleting a reply with the correct password', function (done) {
			  chai
				.request(server)
				.delete('/api/replies/fcc_test') 
				.send({  thread_id: '638737cc4a9de5bcec2b0fe6',
               reply_id:'638733afaa22b4647986bffc',
               delete_password: 'delete_me' })
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});

  test('Reporting a reply', function (done) {
			  chai
				.request(server)
				.put('/api/threads/general') 
				.send({  thread_id: '638732feaa22b4647986bfdb',reply_id:'6387334caa22b4647986bfe1'})
				.end(function (err, res) {
				  assert.equal(res.status, 200);
				  done();
				});
		});
});
