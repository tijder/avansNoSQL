const Thread = require('../models/thread')
const Comment = require('../models/comment')
const User = require('../models/user')

module.exports = {
  get(req, res, next) {
    Thread.find({}, function (err, threads) {
      res.send(threads)
    })
  },

  create(req, res, next) {
    if (req.body['content'] === undefined || req.body['userName'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    if(req.params.threadid !== undefined) {
      Thread.findOne({
        _id: req.params.threadid
      }, function (err, thread) {
        if (err) {
          res.status(400).json(err)
        } else if (!thread) {
          res.status(422).json({})
        } else {
          User.findOne({
            name: req.body['userName']
          }, function (err, user) {
            if (err) {
              res.status(400).json(err)           
            } else if (!user) {
              res.status(422).json({})
            } else {
              let comment = new Comment({
                content: req.body['content'],
                user: user.id
              })
  
              comment.save()
                .then(() => {
                  thread.comments = thread.comments.concat(comment)
                  thread.save(function (err) {
                    if (err) {
                      res.status(400).json(err)           
                    } else {
                      comment.username = user.name
                      res.status(200).json(comment)           
                    }
                  })
                }).catch(err => {
                  res.status(400).json(err)
                })
            }
          })
        }
      })  
    }
    if(req.params.commentid !== undefined) {
      Comment.findOne({
        _id: req.params.commentid
      }, function (err, comment) {
        if (err) {
          res.status(400).json(err)           
        } else if (!comment) {
          res.status(422).json({})
        } else {
          User.findOne({
            _id: req.body['userName']
          }, function (err, user) {
            if (err) {
              res.status(400).json(err)        
            } else if (!user) {
              res.status(422).json({})
            } else {
              let newComment = new Comment({
                content: req.body['content'],
                user: user.id
              })
  
              newComment.save()
                .then(() => {
                  comment.comments = comment.comments.concat(newComment)
                  newComment.save(function (err) {
                    if (err) {
                      res.status(400).json(err)
                    } else {
                      newComment.username = user.name
                      res.status(200).json(newComment)           
                    }
                  })
                }).catch(err => {
                  res.status(400).json(err)
                })
            }
          })
        }
      })
    }
  },

  createUpvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let comment

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 0) {
          comment.votes = comment.votes.concat({
            rated: true,
            user: user._id
          })
        } else if (voted[0].rated === false) {
          let doc = comment.votes.id(voted[0]._id)
          doc.set({
            rated: true
          })
        }

        comment.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Upvoted comment: ' + req.body['commentId']
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  destroy(req, res, next) {
    if (req.body['id'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
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
        res.status(400).json(err)
      } else {
        res.status(200).json({
          message: 'Deleted comment: ' + req.body['id']
        })
      }
    })
  },

  createDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let comment

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 0) {
          comment.votes = comment.votes.concat({
            rated: false,
            user: user._id
          })
        } else if (voted[0].rated === true) {
          let doc = comment.votes.id(voted[0]._id)
          doc.set({
            rated: false
          })
        }

        comment.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Upvoted comment: ' + req.body['commentId']
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  destroyUpvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }
    
    let comment

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        comment.username = user.name

        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 1 && voted[0].rated === true) {
          comment.votes.id(voted[0]._id).remove()
        }

        comment.save(function (err) {
          if (err) {
            res.status(400).json(err)         
          } else {
            res.status(200).json({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  destroyDownvote(req, res, next) {
    if (req.body['commentId'] === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }
    
    let comment

    Comment.findOne({
        _id: req.body['commentId']
      })
      .then((result) => {
        comment = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        comment.username = user.name

        const voted = comment.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 1 && voted[0].rated === false) {
          comment.votes.id(voted[0]._id).remove()
        }

        comment.save(function (err) {
          if (err) {
            res.status(400).json(err)          
          } else {
            res.status(200).json({
              message: 'Deleted upvote from comment: ' + req.body['commentId']
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}