const express = require('express');
const router = express.Router();

const {login} = require('../router_handler/login')

router.options('/login', (req, res) => {
    res.sendStatus(200);
});

router.post('/login', login)

module.exports = router
