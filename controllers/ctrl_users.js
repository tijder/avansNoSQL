const {session} = require('../neodb');
const userQueries = require('../models/user_queries');
const User = require('../models/user');

module.exports = {
  create(req, res, next) {
    if (req.query.name === undefined || req.query.password === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }
    const user = new User({
      name: req.query.name,
      password: req.query.password
    });
    user.save()
      .then(() => {
        console.log(user)
        result = userQueries.createUser(session, user._id)
        res.status(200).json(user)
      }).catch(err => {
        if (err.code === 11000) {
          res.status(422)
          res.send('user already exists')
      } else {
          res.status(500).send(err)
        }
      });
  },

  update(req, res, next) {
    if (req.query.name === undefined || req.query.password === undefined || req.query.newpassword === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    User.findOne({name: req.query.name, password: req.query.password}).then(user => {
      if(!user){
          res.status(401).json({})
          return
      }
      user.password = req.query.newpassword
      user.save().then(() => {
        res.status(200).json(user)
      }).catch(err => {
        res.status(500).send(err)
      })
    })
  },

  destroy(req, res, next) {
    if (req.query.name === undefined || req.query.password === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    User.findOne({name: req.query.name, password: req.query.password}).then(user => {
      if(!user){
          res.status(401).json({})
          return
      }
      user.active = false
      user.save().then(() => {
        res.status(200).json(user)
      }).catch(err => {
        res.status(500).send(err)
      })
    })
  },

  createFriendship(req, res, next) {
    if (req.params.userone === undefined || req.params.usertwo === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    User.find({$or: [{name: req.params.userone}, {name: req.params.usertwo}]}).then(user => {
      if(user.length != 2){
          res.status(422).json({})
          return
      }
      userQueries.createFriends(session, user[0]._id, user[1]._id)
      res.status(200).json(user)
    })
  },

  destroyFriendship(req, res, next) {
    if (req.params.userone === undefined || req.params.usertwo === undefined) {
      console.log('ERROR 400', req.body);
      res.status(400).json({
        message: 'Missing or wrong parameters.'
      });
      return;
    }

    User.find({$or: [{name: req.params.userone}, {name: req.params.usertwo}]}).then(user => {
      if(user.length != 2){
          res.status(422).json({})
          return
      }
      userQueries.destroyFriends(session, user[0]._id, user[1]._id)
      res.status(200).json(user)
    })
  },
}
