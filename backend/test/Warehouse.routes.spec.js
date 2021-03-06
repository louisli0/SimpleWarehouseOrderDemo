process.env.NODE_ENV = 'test';

const { assert, expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Warehouse Controller', () => {
  let accessToken = '';
  let userId = '';
  before(async () => {
    const res = await chai.request(server).post('/api/v1/user/login').send({
      emailAddress: 'f',
      password: 'f',
    });
    accessToken = res.body.access;
    userId = res.body.uID;
  });

  let testId = 0;
  describe('Create/Read/Update/Delete Workflow', () => {
    it('Add warehouse', async () => {
      const result = await chai
        .request(server)
        .post('/api/v1/warehouse/')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          name: 'Warehouse Test',
        });
      testId = result.body.id;
      assert.equal(result.status, 200);
    });

    it('Retrieve warehouse Data', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/warehouse/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();

      assert.equal(result.status, 200);
      assert.equal(result.body.id, testId);
      assert.equal(result.body.name, 'Warehouse Test');
    });

    it('Update warehouse Data', async () => {
      const result = await chai
        .request(server)
        .put(`/api/v1/warehouse/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          name: 'Warehouse Test 2',
        });
      assert.equal(result.status, 204);
    });

    it('Retrieve Modified warehouse', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/warehouse/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      assert.equal(result.status, 200);
      assert.equal(result.body.id, testId);
      assert.equal(result.body.name, 'Warehouse Test 2');
    });

    it('Delete Item', async () => {
      var result = await chai
        .request(server)
        .delete(`/api/v1/warehouse/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          userId: userId,
        });
      assert.equal(result.status, 204);
    });
  });
});
