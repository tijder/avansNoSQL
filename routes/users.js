var express = require('express');
var router = express.Router();

const userController = require('../controllers/ctrl_users')

router.post('/', userController.create) // 1a
router.put('/', userController.update) // 1b
router.delete('/', userController.destroy) // 1c

router.post('/friendship/:userone/:usertwo', friendshipController.get) // 2a
router.delete('/friendship/:userone/:usertwo', friendshipController.destroy) // 2a

module.exports = router;
