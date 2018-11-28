const Thread = require('../models/thread');
const User = require('../models/user');

module.exports = {
  get(req, res, next) {
    Thread.find({}, function (err, threads) {
      res.send(threads);
    });
  },

  create(req, res, next) {
    if (req.body['title'] === undefined || req.body['content'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    User.findOne({_id: req.body['userId']}).then(user => {
      if(!user){
          res.status(422).json({})
          return
      }
      const thread = new Thread({
        title: req.body['title'],
        content: req.body['content'],
        user: user._id
      });
  
      thread.save()
        .then(() => {
          res.status(200).json(thread);
        }).catch(err => {
          res.status(400).json(err);
        });
    })
  },

  update(req, res, next) {
    if (req.body['id'] === undefined || req.body['content'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    Thread.findOne({_id: req.body['id']}).then(thread => {
      if(!thread){
          res.status(422).json({})
          return
      }
      thread.content = req.body['content']
  
      thread.save()
        .then(() => {
          res.status(200).json(thread);
        }).catch(err => {
          res.status(400).json(err);
        });
    })
  },

  destroy(req, res, next) {
    if (req.body['id'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    Thread.remove({
      _id: req.body['id']
    }, function (err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({
          message: 'Deleted thread: ' + req.body['id']
        });
      }
    });
  },

  getSorted(req, res, next) {},

  getByFriendships(req, res, next) {},

  createUpvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    let thread;

    Thread.findOne({
        _id: req.body['threadId']
      })
      .then((result) => {
        thread = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 0) {
          thread.votes = thread.votes.concat({
            rated: true,
            user: user._id
          });
        } else if (voted[0].rated === false) {
          let doc = thread.votes.id(voted[0]._id);
          doc.set({
            rated: true
          });
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Upvoted thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);          
      });
  },

  createDownvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    let thread;

    Thread.findOne({
        _id: req.body['threadId']
      })
      .then((result) => {
        thread = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 0) {
          thread.votes = thread.votes.concat({
            rated: false,
            user: user._id
          });
        } else if (voted[0].rated === true) {
          let doc = thread.votes.id(voted[0]._id);
          doc.set({
            rated: false
          });
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Downvoted thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);          
      });
  },

  destroyUpvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    let thread;

    Thread.findOne({
        _id: req.body['threadId']
      })
      .then((result) => {
        thread = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 1 && voted[0].rated === true) {
          thread.votes.id(voted[0]._id).remove();
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Deleted upvote from thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);          
      });
  },

  destroyDownvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    let thread;

    Thread.findOne({
        _id: req.body['threadId']
      })
      .then((result) => {
        thread = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 1 && voted[0].rated === false) {
          thread.votes.id(voted[0]._id).remove();
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Deleted downvote from thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);          
      });
  }
}