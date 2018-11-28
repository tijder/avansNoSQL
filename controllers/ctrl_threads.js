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
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    const thread = new Thread({
      title: req.body['title'],
      content: req.body['content'],
      user: req.body['userId']
    });
    thread.save()
      .then(() => {
        res.send(thread);
      }).catch(err => {
        res.send({
          message: err
        });
      });
  },

  update(req, res, next) {
    if (req.body['id'] === undefined || req.body['content'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    Thread.update({
      _id: req.body['id']
    }, {
      $set: {
        content: req.body['content']
      }
    }, function (err) {
      if (err) {
        res.send({
          message: err
        });
      } else {
        res.send({
          message: 'Updated thread: ' + req.body['id']
        })
      }
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

    Thread.remove({
      _id: req.body['id']
    }, function (err) {
      if (err) {
        res.send({
          message: err
        });
      } else {
        res.send({
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
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
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
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Upvoted thread: ' + req.body['threadId']
            })
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  },

  createDownvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
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
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Downvoted thread: ' + req.body['threadId']
            })
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  },

  destroyUpvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
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
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Deleted upvote from thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  },

  destroyDownvote(req, res, next) {
    if (req.body['threadId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
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
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Deleted downvote from thread: ' + req.body['threadId']
            });
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  }
}