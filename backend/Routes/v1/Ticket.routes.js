const Router = require('express').Router();
const TicketHelper = new (require('../../Services/Ticket.helper'))();
const { verify } = require('../middleware');

// Get a single Ticket id
Router.get('/:id', verify, async (req, res) => {
  try {
    var result = await TicketHelper.GetById(req.params.id);

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//Get A ticket according to query parameters.
Router.get('/', verify, async (req, res) => {
  try {
    const { uId, type, search } = req.query;
    console.log(req.query);

    if (type == 'non-assigned') {
      // Non-Assigned Route
      var result = await TicketHelper.GetNonAssigned();
      return res.status(200).send(result);
    }

    if (type == 'assigned' && uId) {
      var result = await TicketHelper.GetAssigned(uId);
      return res.status(200).send(result);
    }

    if (search != undefined) {
      var result = await TicketHelper.GetById(search);
      return res.status(200).send(result);
    }

    if(type == 'created') {
      var result = await TicketHelper.GetCreated(uId);
      return res.status(200).send(result)
    }

    var result = await TicketHelper.GetAll(req.query.uId);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Add New Ticket
Router.post('/', verify, async (req, res) => {
  try {
    var result = await TicketHelper.Create(req.body);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Update Ticket Status
Router.put('/:id', verify, async (req, res) => {
  try {
    var result = await TicketHelper.Update(req.params.id, req.body);
    if (result) {
      res.status(204).send();
    } else {
      res.status(400).send('Ticket was not found or another error occured');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Add Ticket Status
Router.post('/:id/activity', verify, async (req, res) => {
  try {
    var result = await TicketHelper.AddActivity(req.body);
    if (result) {
      res.status(204).send();
    } else {
      res.status(400).send('Ticket was not found or another error occured');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = Router;
