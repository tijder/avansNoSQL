const Thread = require('../models/thread');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = {
  get(req, res, next) {},

  create(req, res, next) {
    if (req.body['content'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    if(req.body['threadId'] !== undefined) {
      Thread.findOne({
        _id: req.body['threadId']
      }, function (err, thread) {
        if (err) {
          res.send({
            message: err
          });
        } else {
          User.findOne({
            _id: req.body['userId']
          }, function (err, user) {
            if (err) {
              res.send({
                message: err
              });            
            } else {
              let comment = new Comment({
                content: req.body['content'],
                user: req.body['userId']
              });
  
              comment.save()
                .then(() => {
                  thread.comments = thread.comments.concat(comment);
                  thread.save(function (err) {
                    if (err) {
                      res.send({
                        message: err
                      });
                    } else {
                      comment.username = user.name;
                      res.send(JSON.stringify(comment));
                    }
                  });
                }).catch(err => {
                  console.log(err);
                  done();
                });
            }
          });
        }
      });  
    }
    if(req.body['commentId'] !== undefined) {
      Comment.findOne({
        _id: req.body['commentId']
      }, function (err, comment) {
        if (err) {
          res.send({
            message: err
          });
        } else {
          User.findOne({
            _id: req.body['userId']
          }, function (err, user) {
            if (err) {
              res.send({
                message: err
              });            
            } else {
              let comment = new Comment({
                content: req.body['content'],
                user: req.body['userId']
              });
  
              comment.save()
                .then(() => {
                  comment.comments = comment.comments.concat(comment);
                  comment.save(function (err) {
                    if (err) {
                      res.send({
                        message: err
                      });
                    } else {
                      comment.username = user.name;
                      res.send(JSON.stringify(comment));
                    }
                  });
                }).catch(err => {
                  console.log(err);
                  done();
                });
            }
          });
        }
      });
    }
  },

  createUpvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    let comment;

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 0) {
          comment.votes = comment.votes.concat({
            rated: true,
            user: user._id
          });
        } else if (voted[0].rated === false) {
          let doc = comment.votes.id(voted[0]._id);
          doc.set({
            rated: true
          });
        }

        comment.save(function (err) {
          if (err) {
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Upvoted comment: ' + req.body['commentId']
            })
          }
        });
      })
      .catch(err => {
        console.log(err)
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

    Comment.update({
      _id: req.body['id']
    }, {
      $set: {
        content: '[Deleted]',
        username: '[Deleted]'
      }
    }, function (err) {
      if (err) {
        res.send({
          message: err
        });
      } else {
        res.send({
          message: 'Deleted comment: ' + req.body['id']
        })
      }
    });
  },

  createDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }

    let comment;

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 0) {
          comment.votes = comment.votes.concat({
            rated: false,
            user: user._id
          });
        } else if (voted[0].rated === true) {
          let doc = comment.votes.id(voted[0]._id);
          doc.set({
            rated: false
          });
        }

        comment.save(function (err) {
          if (err) {
            res.send({
              message: err
            });
          } else {
            res.send({
              message: 'Upvoted comment: ' + req.body['commentId']
            })
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  },

  destroyUpvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }
    
    let comment;

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        comment.username = user.name;

        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 1 && voted[0].rated === true) {
          comment.votes.id(voted[0]._id).remove();
        }

        comment.save(function (err) {
          if (err) {
            res.send({
              message: err
            });            
          } else {
            res.send({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  },

  destroyDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).send({
        message: 'Missing or wrong parameters.'
      }).end();
      return;
    }
    
    let comment;

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result;
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        comment.username = user.name;

        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString();
        });

        if (voted.length === 1 && voted[0].rated === false) {
          comment.votes.id(voted[0]._id).remove();
        }

        comment.save(function (err) {
          if (err) {
            res.send({
              message: err
            });            
          } else {
            res.send({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        console.log(err)
      });
  }
}