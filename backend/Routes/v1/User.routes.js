const Router = require('express').Router();
const UserService = new (require('../../Services/User.helper'))();
const RegisteredItems = new (require('../../Services/Item.helper'))();
const { verify } = require('../middleware');

Router.get('/:id?', verify, async (req, res) => {
  try {
    console.log(req.headers.authorization);
    var userToken = JSON.parse(
      Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString()
    );
    // Get Roles List
    if (userToken.role) {
      console.log('Staff Access, can access any user, query any user');
    }

    var result = await UserService.GetById(userToken.userId);
    res.status(200).send(result);
  } catch (err) {
    console.log('User get error', err);
    res.status(500).send(err);
  }
});

Router.post('/register', async (req, res) => {
  try {
    var result = await UserService.Register(req.body);
    if (result) {
      res.status(201).send();
    } else {
      res.status(400).send('Failed');
    }
  } catch (err) {
    res.status(500).send('Server failed to register');
  }
});

Router.post('/login', async (req, res) => {
  try {
    var result = await UserService.Login(req.body);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(401).send('Login Failed');
    }
  } catch (err) {
    res.status(500).send('Internal Error');
  }
});

Router.post('/logout', async (req, res) => {
  try {
    console.log(req.body);
    var result = await UserService.Logout(req.body);
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

Router.post('/refresh', verify, async (req, res) => {
  try {
    var result = await UserService.Refresh(req.body);
    console.log(result);
    if (result) {
      console.log('a');
      res.status(200).send(result);
    } else if (!result) {
      console.log('b');
      res.status(401).send('Relogin');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Error');
  }
});

// Items Route
Router.get('/items/registered', verify, async (req, res) => {
  try {
    // Get UserID
    const decodedAuthHeader = JSON.parse(
      Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString()
    );
    const data = decodedAuthHeader.uId;
    var results = await ItemsService.RegisteredItemsA(data);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = Router;
