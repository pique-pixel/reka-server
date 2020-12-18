"use strict";

const Validator = require('./validator');

class ActivityValidator extends Validator {
  /**
   * Rules
   */
  rules = {
    name: 'string',
    frequency: 'string',
    location: 'string',
  };
}

module.exports=ActivityValidator;