const Thread = require('../models/thread');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = {
  get(req, res, next) {},

  create(req, res, next) {
    if (req.body['content'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    if(req.body['threadId'] !== undefined) {
      Thread.findOne({
        _id: req.body['threadId']
      }, function (err, thread) {
        if (err) {
          res.status(400).json(err);
        } else {
          User.findOne({
            _id: req.body['userId']
          }, function (err, user) {
            if (err) {
              res.status(400).json(err);           
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
                      res.status(400).json(err);           
                    } else {
                      comment.username = user.name;
                      res.status(200).json(comment);           
                    }
                  });
                }).catch(err => {
                  res.status(400).json(err);
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
          res.status(400).json(err);           
        } else {
          User.findOne({
            _id: req.body['userId']
          }, function (err, user) {
            if (err) {
              res.status(400).json(err);        
            } else {
              let newComment = new Comment({
                content: req.body['content'],
                user: req.body['userId']
              });
  
              newComment.save()
                .then(() => {
                  comment.comments = comment.comments.concat(comment);
                  comment.save(function (err) {
                    if (err) {
                      res.status(400).json(err);
                    } else {
                      comment.username = user.name;
                      res.status(200).json(comment);           
                    }
                  });
                }).catch(err => {
                  res.status(400).json(err);
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
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
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
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Upvoted comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  },

  destroy(req, res, next) {
    if (req.body['id'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
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
        res.status(400).json(err);
      } else {
        res.status(200).json({
          message: 'Deleted comment: ' + req.body['id']
        });
      }
    });
  },

  createDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
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
            res.status(400).json(err);
          } else {
            res.status(200).json({
              message: 'Upvoted comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  },

  destroyUpvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
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
            res.status(400).json(err);         
          } else {
            res.status(200).json({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  },

  destroyDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
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
            res.status(400).json(err);          
          } else {
            res.status(200).json({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            });
          }
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
}