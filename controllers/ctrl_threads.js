const Thread = require('../models/thread');

module.exports = {
  get(req, res, next) {
    Thread.find({ });
  },

  create(req, res, next) {
    if (req.body['title'] === undefined || req.body['content'] === undefined || req.body['user'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    const thread = new Thread({
      title: req.body['title'],
      content: req.body['content'],
      user: req.body['user']
    });

    thread.save();
  },

  update(req, res, next) {
    if (req.body['id'] === undefined || req.body['title'] === undefined || req.body['content'] === undefined || req.body['user'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    Thread.findByIdAndUpdate(req.body['id'], {
      title: req.body['title'],
      content: req.body['content']
    });
  },

  destroy(req, res, next) {
    if (req.body['id'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    Thread.findByIdAndRemove(req.body['id']);
  },

  getSorted(req, res, next) {},

  getByFriendships(req, res, next) {},

  createUpvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined || req.body['rated'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    // TODO: get the thread and look in the votes array whenever the user hasn't voted yet. 
    // After that check if rated is true to create an upvote.
  },

  createDownvote(req, res, next) {},

  destroyUpvote(req, res, next) {},

  destroyDownvote(req, res, next) {}
}