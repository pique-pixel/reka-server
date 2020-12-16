'use strict';

const User = require('../models/user');

const JWT = require('jsonwebtoken');

const MainHelper = require('../helpers/main_helper');

const response401 = {
    message: "Unauthenticated"
}

function AuthMiddleware(req, res, next) {

    // check if auth Authorization header exists

    if (req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        const pieces = authHeader.split(' ');
        if (pieces.length === 2) {
            const token = pieces[1];

            //validate token
            

            JWT.verify(token, process.env.APP_KEY, function (err, data) {
                if (err) {
                    return res.status(401).json(response401);
                }
                User.findOne({
                    email: data.email,
                    isDeleted: false,
                    isActive: true,
                })
                    .then(user => {
                        // check if user is still active
                        if (!user) {
                            return res.status(401).json(response401);
                        }
                        // delete all tokens if user inactive
                        if (user.isDeleted || !user.isActive) {
                            MainHelper.deleteUserToken(user);
                            return res.status(401).json(response401);
                        } else {
                            // if all is well forward the request
                            req.user = user;
                            next();
                        }
                    }).catch(err => {
                        console.log(err);
                    });
            });
        } else {
            return res.status(401).json(response401);
        }
    } else {
        return res.status(401).json(response401);
    }

}

module.exports = AuthMiddleware;
