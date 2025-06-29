const express = require('express')
const router = express.Router()

const { userinfo } = require('../router_handler/userinfo')

const joi = require('@escook/express-joi')

const { userinfo_schema } = require('../schema/userinfo')

const authMiddlewere = require('../authMiddleware')


router.options('/userinfo', (req, res) => {
    res.sendStatus(200);
  });

router.post('/userinfo', authMiddlewere, joi(userinfo_schema), userinfo)

module.exports = router