var express = require('express');
var router = express.Router();

const commandController = require('../controllers/ctrl_commands')

router.post('thread/:threadid', commandController.create) // 4a
router.post('comment/:commentid', commandController.create) // 4b

router.delete(':commentid', commandController.create) // 4a

router.post('/:commentid/upvote', commandController.createUpvote) // 4d
router.delete('/commentid/upvote', commandController.destroyUpvote) // 4d

router.post('/:commentid/downvote', commandController.createDownvote) // 4e
router.delete('/commentid/downvote', commandController.destroyDownvote) // 4e

module.exports = router;
