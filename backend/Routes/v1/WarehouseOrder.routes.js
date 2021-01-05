const Router = require('express').Router();
const { verify } = require('../middleware');
const WarehouseOrderHelper = new (require('../../Services/WarehouseOrder.helper'))();

Router.post('/', verify, async (req, res) => {
  try {
    var result = await WarehouseOrderHelper.Create(req.body);
    if (result) {
      res.status(200).send();
    }
    res.status(400).send();
  } catch (err) {
    console.log('Create Error', err);
    res.status(500).send('Internal Error Occured');
  }
});

Router.put('/:id', verify, async (req, res) => {
  try {
    var result = await WarehouseOrderHelper.Edit(req.body);
    if (result) {
      res.status(200).send();
    }
    res.status(400).send();
  } catch (err) {
    console.log('Update Error', err);
    res.status(500).send();
  }
});

module.exports = Router;
