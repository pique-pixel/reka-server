const express = require('express');
const Router = express.Router();

 /**
 * Application routes
 */

Router.use('/', require('./test'));
Router.use('/api', require('./user_apis'));

Router.use('*', (req, res) => {
    res.status(404).json({
        message: "You might be lost"
    });
})


/**
 * Export all application routes
 */

 module.exports = Router;
