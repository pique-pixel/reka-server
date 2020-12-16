const ApiToken = require("../models/api_token");
const ResponseHelper = require('./response_helper');
const LoginLog = require('../models/login_log');

class MainHelper extends ResponseHelper {

    static deleteUserToken(user, all = false) {
        return new Promise((resolve, reject) => {
            ApiToken.deleteMany({
                email: user.email
            })
                .then(response => {
                    resolve();
                })
                .catch(err => {
                    reject();
                });
        });
    }

    static mongoIdValidationRule() {
        return "regex:/^[0-9a-fA-F]{24}$/";
    }

    static isValidMongoId(id = "") {
        return id.match(/^[0-9a-fA-F]{24}$/);
    }

    static createLoginLog(userType, userId, ipAddress, status) {
        LoginLog.create({userType, userId, ipAddress, status});
    }
}

module.exports = MainHelper;
