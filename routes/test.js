const express = require('express');
const Router = express.Router();

Router.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
})

module.exports = Router;