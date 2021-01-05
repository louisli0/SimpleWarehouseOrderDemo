const Router = require('express').Router();
const WarehouseService = new (require('../../Services/Warehouse.helper'))();
const { verify } = require('../middleware');

Router.get('/', verify, async (req, res) => {
  try {
    var results = await WarehouseService.GetAllAsync();
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    var result = await WarehouseService.GetById(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send();
  }
});

Router.post('/', verify, async (req, res) => {
  try {
    var result = await WarehouseService.Create(req.body);

    if (result) {
      res.status(200).send(result);
    } else if (!results) {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.put('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    var result = await WarehouseService.Update(id, data);
    if (result) {
      res.status(204).send();
    } else if (!result) {
      res.status(400).send('Unable to update warehouse location');
    }
  } catch {
    res.status(500).send();
  }
});

Router.delete('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;

    var result = await WarehouseService.Delete(id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(400).send('Operation Failed');
    }
  } catch (err) {
    res.status(500).send('Internal Error Occured');
  }
});

Router.get('/item/:id', verify, async (req, res) => {
  try {
    var result = await WarehouseService.FindWHItemInventory(req.params.id);
    if (result) {
      res.status(200).senmd(result);
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = Router;
