const express = require('express');
const bodyParser = require('body-parser');

const api = express.Router();
api.use(bodyParser.json());

api.use((req, res, next) => {
    req.API_START_MILLIS = new Date();
    next()
});
api.use('/tasks', require('./tasks'));
api.use('/counts', require('./counts'));

module.exports = api;