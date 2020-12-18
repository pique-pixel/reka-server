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
const ActivityController=require('../controllers/activity_controller');
const PersonController=require('../controllers/person_controller');


//Auth Routes
Router.post('/register',AuthController.register);
Router.post('/login',AuthController.login);

//Activity Routes
Router.post('/activity',ActivityController.create);
Router.get('/activity/list',ActivityController.list);
Router.get('/activity/:id',ActivityController.get);


//Person Routes
Router.post('/person',PersonController.create);
Router.get('/person/list',PersonController.list);
Router.get('/person/:id',PersonController.get);


module.exports=Router;
