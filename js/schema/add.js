const joi = require('joi')

// 用户名规则
const username = joi.string().min(3).max(10).required()
// 密码规则
const password = joi.string().pattern(/^[\S]{6,12}$/)

exports.reg_login_schema= {
    body: {
        username,
        password
    }
}