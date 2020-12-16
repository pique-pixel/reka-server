const JWT = require("jsonwebtoken");
const md5 = require("md5");
const Bcrypt = require('bcrypt');
const moment = require('moment');

const LoginValidator = require("../validators/login_validator");
const RegisterValidator = require('../validators/register_validator');
const MainHelper = require('../helpers/main_helper')
const User = require('../models/user');
const ApiToken = require("../models/api_token");

const { validate } = require("uuid");

class AuthController {

    static  register(req, res) {
        const validator = new RegisterValidator(req);
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
                        User.create(validated)
                        .then(user => {
                            return res.json({
                                message: "Registration Successful!",
                                data: user.toObject()
                            });
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

        User.findOne({email: validated.email})
            .then(user => {

                if (!user) {
                    return res.status(422).json({
                        message: "User not found!",
                        errors: {user: ["User not found!"]}
                    });
                } else {
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
                            ApiToken.create({email: user.email, token: token})
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

}

module.exports = AuthController;
