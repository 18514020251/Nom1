const express = require('express');
const router = express.Router();
const avatarHandler = require('../router_handler/avatar');
const upload = require('../utils/fileupload');
const authenticate = require('../authMiddleware');


router.post('/avatar', authenticate,upload.single('avatar'),avatarHandler.updateAvatar);


router.get('/avatar', authenticate, avatarHandler.getUserAvatar);



module.exports = router;

