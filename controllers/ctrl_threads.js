const Thread = require('../models/thread')
const Comment = require('../models/comment')
const User = require('../models/user')
const {session} = require('../neodb')
const userQueries = require('../models/user_queries')

module.exports = {
  get(req, res, next) {
    Thread.find({}).populate('user').exec(function (err, threads) {
      res.send(threads)
    })
  },

  getSortedAsc(req, res, next) {
    Thread.find({}).populate('user').exec(function (err, threads) {
      threads.sort((a,b) => (a.upVotes < b.upVotes) ? 1 : ((b.upVotes < a.upVotes) ? -1 : 0))
      res.send(threads)
    })
  },

  getSortedDesc(req, res, next) {
    Thread.find({}).populate('user').exec(function (err, threads) {
      threads.sort((a,b) => (a.upVsDownVotes < b.upVsDownVotes) ? 1 : ((b.upVsDownVotes < a.upVsDownVotes) ? -1 : 0))
      res.send(threads)
    })
  },

  getByComments(req, res, next) {
    Thread.find({}).populate('user').sort('-comments').exec(function (err, threads) {
      res.send(threads)
    })
  },

  create(req, res, next) {
    if (req.body['title'] === undefined || req.body['content'] === undefined || req.body['userName'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    User.findOne({name: req.body['userName']}).then(user => {
      if(!user){
          res.status(422).json({})
          return
      }
      const thread = new Thread({
        title: req.body['title'],
        content: req.body['content'],
        user: user._id,
        username: req.body['userName']
      })
  
      thread.save()
        .then(() => {
          res.status(200).json(thread)
        }).catch(err => {
          res.status(400).json(err)
        })
    })
  },

  update(req, res, next) {
    if (req.body['id'] === undefined || req.body['content'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    Thread.findOne({_id: req.body['id']}).then(thread => {
      if(!thread){
          res.status(422).json({})
          return
      }
      thread.content = req.body['content']
  
      thread.save()
        .then(() => {
          res.status(200).json(thread)
        }).catch(err => {
          res.status(400).json(err)
        })
    })
  },

  destroy(req, res, next) {
    if (req.params.threadid === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    Thread.findOne({_id: req.params.threadid}).populate('comments').then(thread => {
      if(!thread){
          res.status(422).json({})
          return
      }
      for (var i = 0; i < thread.comments.length; i++) {
        Comment.remove({_id: thread.comments[i].id}).exec()
      }
      Thread.remove({_id: thread.id}).exec()
      res.status(200).json({})
    })
  },

  getByFriendships(req, res, next) {
    if (req.params.count === undefined || req.query.userId === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    User.findOne({_id: req.query.userId}).then(user => {
      if(!user){
          res.status(422).json({})
          return
      }
      userQueries.getFriendsOfFriends(session, user._id, req.params.count).then(result => {
        Thread.find({user: result}).populate('user').exec(function (err, threads) {
          res.status(200).json(threads)
        })
      })
    })
  },

  createUpvote(req, res, next) {
    if (req.params.threadid === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let thread

    Thread.findOne({
        _id: req.params.threadid
      })
      .then((result) => {
        thread = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 0) {
          thread.votes = thread.votes.concat({
            rated: true,
            user: user._id
          })
        } else if (voted[0].rated === false) {
          let doc = thread.votes.id(voted[0]._id)
          doc.set({
            rated: true
          })
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Upvoted thread: ' + req.params.threadid
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)          
      })
  },

  createDownvote(req, res, next) {
    if (req.params.threadid === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let thread

    Thread.findOne({
        _id: req.params.threadid
      })
      .then((result) => {
        thread = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 0) {
          thread.votes = thread.votes.concat({
            rated: false,
            user: user._id
          })
        } else if (voted[0].rated === true) {
          let doc = thread.votes.id(voted[0]._id)
          doc.set({
            rated: false
          })
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Downvoted thread: ' + req.params.threadid
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)          
      })
  },

  destroyUpvote(req, res, next) {
    if (req.params.threadid === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let thread

    Thread.findOne({
        _id: req.params.threadid
      })
      .then((result) => {
        thread = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 1 && voted[0].rated === true) {
          thread.votes.id(voted[0]._id).remove()
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Deleted upvote from thread: ' + req.params.threadid
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)          
      })
  },

  destroyDownvote(req, res, next) {
    if (req.params.threadid === undefined || req.body['userId'] === undefined) {
      console.log('ERROR 400', req.body)
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      })
      return
    }

    let thread

    Thread.findOne({
        _id: req.params.threadid
      })
      .then((result) => {
        thread = result
      })
      .then(() => User.findOne({
        _id: req.body['userId']
      }))
      .then((user) => {
        const voted = thread.votes.filter(function (element) {
          return element.user.toString() === user._id.toString()
        })

        if (voted.length === 1 && voted[0].rated === false) {
          thread.votes.id(voted[0]._id).remove()
        }

        thread.save(function (err) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.status(200).json({
              message: 'Deleted downvote from thread: ' + req.params.threadid
            })
          }
        })
      })
      .catch(err => {
        res.status(400).json(err)          
      })
  }
}