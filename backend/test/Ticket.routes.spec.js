process.env.NODE_ENV = 'test';

const { assert, expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
const { Console } = require('winston/lib/winston/transports');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Ticket Controller', () => {
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
    it('Add ticket', async () => {
      const result = await chai
        .request(server)
        .post('/api/v1/ticket/')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          type: 'Test',
          userId: userId,
          items: [{ id: 1 }, { id: 2 }],
          description: 'Test',
        });
      testId = result.body.id;
      assert.equal(result.status, 200);
    });

    it('Retrieve ticket Data', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/ticket/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();

      assert.equal(result.status, 200);
      assert.equal(result.body.details[0].id, testId);
      assert.equal(result.body.details[0].creator, userId);
      assert.equal(result.body.details[0].type, 'Test');
    });

    it('Update ticket Data', async () => {
      const result = await chai
        .request(server)
        .put(`/api/v1/ticket/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          status: 'TestStatus',
        });
      assert.equal(result.status, 204);
    });

    it('Retrieve Modified ticket', async () => {
      const result = await chai
        .request(server)
        .get(`/api/v1/ticket/${testId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();

      assert.equal(result.status, 200);
      assert.equal(result.body.details[0].id, testId);
      assert.equal(result.body.details[0].status, 'TestStatus');
    });

    // it('Delete Item', async () => {
    //   var result = await chai
    //     .request(server)
    //     .delete(`/api/v1/ticket/${testId}`)
    //     .set({ Authorization: `Bearer ${accessToken}` })
    //     .send({
    //       userId: userId,
    //     });
    //   assert.equal(result.status, 204);
    // });
  });
});
