process.env.NODE_ENV = 'test';

const { assert, expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Items Controller', () => {
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
    it('Add Item', async () => {
      const result = await chai
        .request(server)
        .post('/api/v1/item/')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          userId: userId,
          name: 'Test',
          description: 'NodeTest',
          category: 'TestItem',
        });
      testId = result.body.id;
      assert.equal(result.status, 200);
    });

    it('Retrieve Item', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/item/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      assert.equal(result.status, 200);
      assert.equal(result.body.id, testId);
      assert.equal(result.body.name, 'Test');
    });

    it('Update Test Item', async () => {
      const result = await chai
        .request(server)
        .put(`/api/v1/item/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          userId: userId,
          name: 'Test 2',
          description: 'TestItem2Desc',
          category: 'TestItem2',
        });
      assert.equal(result.status, 204);
    });

    it('Retrieve Modified Item', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/item/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      assert.equal(result.status, 200);
      assert.equal(result.body.id, testId);
      assert.equal(result.body.name, 'Test 2');
      assert.equal(result.body.description, 'TestItem2Desc');
      assert.equal(result.body.category, 'TestItem2');
    });

    it('Delete Item', async () => {
      var result = await chai
        .request(server)
        .delete(`/api/v1/item/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          userId: userId,
        });
      assert.equal(result.status, 204);
    });
  });
});
