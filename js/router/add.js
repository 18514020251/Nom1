const express = require('express')
const router = express.Router()


const { register } = require('../router_handler/add')

const joi = require('@escook/express-joi')

const { reg_login_schema } = require('../schema/add')


router.options('/', (req, res) => {
    res.sendStatus(200);
});
  
router.post('/' , joi( reg_login_schema ) , register )

module.exports = router