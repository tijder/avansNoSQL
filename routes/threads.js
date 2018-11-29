var express = require('express');
var router = express.Router();

const threadController = require('../controllers/ctrl_threads')

router.get('/', threadController.get) // 3g
router.post('/', threadController.create) // 3a
router.put('/', threadController.update) // 3b
router.delete('/', threadController.destroy) // 3c

router.get('/sort/asc', threadController.getSortedAsc) // 3g
router.get('/sort/desc', threadController.getSortedDesc) // 3g
router.get('/sort/comments', threadController.getByComments) // 3g


router.get('/:threadid', threadController.get) // 3h

router.get('/friendships/:count', threadController.getByFriendships) // 3f

router.post('/:threadid/upvote', threadController.createUpvote) // 3d
router.delete('/threadid/upvote', threadController.destroyUpvote) // 3d

router.post('/:threadid/downvote', threadController.createDownvote) // 3e
router.delete('/threadid/downvote', threadController.destroyDownvote) // 3e

module.exports = router;
