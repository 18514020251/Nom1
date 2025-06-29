const joi = require('joi')

const usernameRegex = /^(?:[\u4e00-\u9fa5]{2,10}|[\u4e00-\u9fa5]{1,5}[·．.][\u4e00-\u9fa5]{1,5})$/;

exports.userinfo_schema = {
  body: {
    username: joi.string().pattern(usernameRegex).required(),
    age: joi.number().integer().min(1).max(150).required(),
    email: joi.string().email().required(),
    gender: joi.string().valid('男', '女').required()
  }
}