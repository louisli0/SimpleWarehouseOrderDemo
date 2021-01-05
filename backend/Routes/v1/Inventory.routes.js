const Router = require('express').Router();
const InventoryService = new (require('../../Services/Inventory.helper'))();

const { verify } = require('../middleware');

Router.get('/stock/:id', verify, async (req, res) => {
  try {
    var result = await InventoryService.FindWHItemInventory(req.params.id);
    if (result) {
      res.status(200).senmd(result);
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/warehouse/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    var result = await InventoryService.GetByWarehouseId(id);
    if (result) {
      res.status(200).send(result);
    } else if (!result) {
      res.status(404);
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/item/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    var result = await InventoryService.GetByItemId(id);
    if (result) {
      res.status(200).send(result);
    } else if (!result) {
      res.status(404);
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    var result = await InventoryService.GetById(id);
    if (result) {
      res.status(200).send(result);
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send();
  }
});

Router.post('/', verify, async (req, res) => {
  try {
    var result = await InventoryService.Create(req.body);
    if (result.id) {
      res.status(200).send(result);
    }
    res.status(400).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

Router.put('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    var result = await InventoryService.Update(id, data);
    if (result) {
      res.status(204).send();
    } else if (!result) {
      res.status(400).send('Unable to update inventory');
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.delete('/:id', verify, async (req, res) => {
  try {
    const data = {
      id: req.params.id,
      userId: req.body.userId,
    };
    var result = await InventoryService.Delete(data);
    if (result) {
      res.status(204).send();
    }
    res.status(400).send();
  } catch (err) {
    console.log('delete error', err);
    res.status(500).send();
  }
});

module.exports = Router;
