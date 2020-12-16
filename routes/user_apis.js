const express = require('express');
const Router = express.Router();

/**
 * Middleware
 */

const AuthMiddleware = require('../middleware/auth_middleware');

/**
 * Controllers
 */

const AuthController=require('../controllers/auth_controller');



Router.post('/register',AuthController.register);
Router.post('/login',AuthController.login);



module.exports=Router;
