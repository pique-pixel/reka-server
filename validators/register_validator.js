"use strict";

const Validator = require('./validator');

module.exports = class RegisterValidator extends Validator {
  /**
   * Rules
   *
   */
  rules = {
    email: 'required|email',
    password: 'required',
  };
}
