var express = require('express');
var router = express.Router();

const commentController = require('../controllers/ctrl_comments')

router.post('thread/:threadid', commentController.create) // 4a
router.post('comment/:commentid', commentController.create) // 4b

router.delete(':commentid', commentController.destroy) // 4a

router.post('/:commentid/upvote', commentController.createUpvote) // 4d
router.delete('/commentid/upvote', commentController.destroyUpvote) // 4d

router.post('/:commentid/downvote', commentController.createDownvote) // 4e
router.delete('/commentid/downvote', commentController.destroyDownvote) // 4e

module.exports = router;
