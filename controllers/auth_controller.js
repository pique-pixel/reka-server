const JWT = require("jsonwebtoken");
const md5 = require("md5");
const Bcrypt = require('bcrypt');
const moment = require('moment');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const LoginValidator = require("../validators/login_validator");
const RegisterValidator = require('../validators/register_validator');
const MainHelper = require('../helpers/main_helper')
const User = require('../models/user');
const ApiToken = require("../models/api_token");

const { validate } = require("uuid");

class AuthController {

    static  register(req, res) {
        const validator = new RegisterValidator(req);
        let ipAddress = req.connection.remoteAddress;
        if (validator.fails()) {
            return res.status(422).json({
                message: "Some validation error occurred!",
                errors: validator.errors().all()
            });
        }

        const validated = validator.validated;

        User.findOne({email: validated.email})
            .then(user => {
                if (user) {
                    // user exists
                    if (user.email === validated.email) {
                        return res.status(422).json({
                            message: "Email already in use!",
                            errors: {email: ["Email already in use!"]}
                        });
                    }
                } else {
                        
                       let newUser={
                           method:'local',
                           local:{
                               email:validated.email,
                               password:validated.password,
                           }
                       }
                        User.create(newUser)
                        .then(user => {
                                
                            console.log('User Details >>>>>',user);
                                JWT.sign(user.toObject(), process.env.APP_KEY, {expiresIn: "365 days"}, function (err, token) {
                                    if (err) {
                                        throw err;
                                    }
                                    ApiToken.create({email: user.local.email, token: token})
                                    .then(apiToken => {
                                        console.log(token)                                    
                                        MainHelper.createLoginLog('User', user.id, ipAddress, 1);
                                        return res.json({
                                            message: "Registration Successful!",
                                            data: user.toObject(),
                                            apiToken: apiToken.toObject()
                                        });
                                    
                                    })
                                    .catch(err => {
                                        throw err;
                                    });
                                }
                        );

                            
                        })
                        .catch(e => {
                            throw e;
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({message: "Some error occured!"});
            });
    }

    static login(req, res) {
        const validator = new LoginValidator(req);
        let ipAddress = req.connection.remoteAddress;
        if (validator.fails()) {
            return res.status(422).json({
                message: "Some validation error occurred!",
                errors: validator.errors().all()
            });
        }

        const validated = validator.validated;

        User.findOne({"local.email": validated.email})
            .then(user => {
                 console.log('User DEtails ')
                 console.log(user)
                if (!user) {
                    return res.status(422).json({
                        message: "User not found!",
                        errors: {user: ["User not found!"]}
                    });
                } else {
                    console.log('IsCorrect',user.compareHash(validated.password));
                    if (!user.compareHash(validated.password)) {

                        MainHelper.createLoginLog('User', user.id, ipAddress, 0);
                        return MainHelper.response422(res,
                            "Password incorrect!",
                            {
                                password: ["Password incorrect!"]
                            })
                    }
                   
                    JWT.sign(user.toObject(), process.env.APP_KEY, {expiresIn: "365 days"}, function (err, token) {
                            if (err) {
                                throw err;
                            }
                            ApiToken.create({email: user.local.email, token: token})
                                .then(apiToken => {
                                    console.log(token)                                    
                                    MainHelper.createLoginLog('User', user.id, ipAddress, 1);
                                    return MainHelper.response200(res,
                                        "Login Successful!",
                                        Object.assign(apiToken.toObject(),user )
                                    );
                                
                                })
                                .catch(err => {
                                    throw err;
                                });
                        }
                    );
                }
            })
            .catch(e => {
                console.log(e);
                res.status(500).json({message: "Some error occurred!"});
            });
    }
   
    static async googleLogin(req,res){
 
        let {id_token}=req.body;
        let ipAddress = req.connection.remoteAddress;

        //verify the token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.CLIENT_ID, 
        });
        
        console.log('ticket >>>>>');
        console.log(ticket)
        let payload=ticket.payload;

        console.log('Payload >>>>>')
        console.log(payload)
        delete payload.exp;

        User.findOne({'google.email':payload.email})
        .then(user=>{
              if(user){

                    console.log('Inside if condition >>>>')
                    console.log(user);

                    JWT.sign(payload, process.env.APP_KEY, {expiresIn: "365 days"} ,function (err, token) {
                            if (err) {
                                throw err;
                            }
                            ApiToken.create({email: user.google.email, token: token})
                            .then(apiToken => {
                                console.log(token)                                    
                                MainHelper.createLoginLog('User', user.id, ipAddress, 1);
                                return MainHelper.response200(res,
                                    "Login Successful!",
                                    Object.assign(apiToken.toObject() )
                                );
                            
                            })
                            .catch(err => {
                                throw err;
                            });
                        }
                   );
              }else{
                 
                let newUser={
                    method:'google',
                    google:{
                        id:payload.sub,
                        email:payload.email,
                    }
                }

                console.log('Inside else >>>>>')
                console.log(newUser)

                User.create(newUser)
                .then(user => {
                        
                        console.log('User Details >>>>>',user);
                        JWT.sign(payload, process.env.APP_KEY, {expiresIn: "365 days"}, function (err, token) {
                            if (err) {
                                throw err;
                            }
                            ApiToken.create({email: user.google.email, token: token})
                            .then(apiToken => {
                                console.log(token)                                    
                                MainHelper.createLoginLog('User', user.id, ipAddress, 1);
                                return res.json({
                                    message: "Registration Successful!",
                                    data:{user:user.toObject(),apiToken: apiToken.toObject()} ,
                                   
                                });
                            
                            })
                            .catch(err => {
                                throw err;
                            });
                        });  
                })
                .catch(e => {
                    throw e;
                });
                
              }
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({message: "Some error occurred!"});
        });

        
    }

    static async appleLogin(req,res){
        
    }
}

module.exports = AuthController;
