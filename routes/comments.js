var express = require('express');
var router = express.Router();

const commentController = require('../controllers/ctrl_comments')

router.get('/', commentController.get) // 4a

router.post('/threads/:threadid', commentController.create) // 4a
router.post('/comments/:commentid', commentController.create) // 4b

router.delete('/:commentid', commentController.destroy) // 4a

router.post('/:commentid/upvote', commentController.createUpvote) // 4d
router.delete('/:commentid/upvote', commentController.destroyUpvote) // 4d

router.post('/:commentid/downvote', commentController.createDownvote) // 4e
router.delete('/:commentid/downvote', commentController.destroyDownvote) // 4e

module.exports = router;
