const Router = require('express').Router();

Router.use('/warehouse', require('./v1/Warehouse.routes'));
Router.use('/item', require('./v1/Item.routes'));
Router.use('/user', require('./v1/User.routes'));
Router.use('/inventory', require('./v1/Inventory.routes'));
Router.use('/ticket', require('./v1/Ticket.routes'));
Router.use('/orderWH', require('./v1/WarehouseOrder.routes'));

module.exports = Router;
