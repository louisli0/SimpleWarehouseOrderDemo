const Router = require('express').Router();
const ItemService = new (require('../../Services/Item.helper'))();
const RegisteredItems = new (require('../../Services/RegisteredItems.helper'))();
const SerialiseItem = new (require('../../Services/SerialisedItems.helper'))();
const { verify } = require('../middleware');

Router.post('/', verify, async (req, res) => {
  try {
    var result = await ItemService.Create(req.body);
    if (result != false) {
      res.status(200).send(result);
    } else {
      res.status(400).send('Error');
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/', verify, async (req, res) => {
  try {
    var result = await ItemService.GetAllAsync();
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.put('/:id', verify, async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    var result = await ItemService.Update(id, updateData);
    if (result) {
      res.status(204).send();
    } else if (!result) {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/:id(\\d+)', verify, async (req, res) => {
  const id = req.params.id;
  try {
    var result = await ItemService.GetById(id);
    if (result) {
      res.status(200).send(result);
    } else if (!result) {
      res.status(400).send();
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
    var result = await ItemService.Delete(data);
    if (result) {
      res.status(204).send();
    }
    res.status(400).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

/**
 * Item Serialisation and User Routes
 */

Router.post('/register', verify, async (req, res) => {
  try {
    var result = await RegisteredItems.Create(req.body);
    if (result) {
      res.status(200).send(result);
    } else if (!result) {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/find', verify, async (req, res) => {
  try {
    var result = await ItemService.GetItemBySerialAndId(req.query);
    if (result.length == 1) {
      res.status(200).send('true');
    } else {
      res.status(200).send('false');
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send();
  }
});

Router.post('/serial', verify, async (req, res) => {
  try {
    var result = await SerialiseItem.Create(req.body);
    if (result) {
      res.status(204).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

Router.get('/serial/item/:id', verify, async (req, res) => {
  try {
    var result = await ItemService.GetAllSerialByItemId(req.params.id);
    if (typeof result != undefined) {
      res.status(200).send(result);
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

Router.get('/registered', verify, async (req, res) => {
  try {
    var results = await ItemService.GetRegisteredItems(req.query.uID);
    if (results.length > 0) {
      res.status(200).send(results);
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).send();
  }
});
module.exports = Router;
