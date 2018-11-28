const {session} = require('../neodb');
const userQueries = require('../models/user_queries');

module.exports = {
  create(req, res, next) {
    result = userQueries.createUser(session, req.query.name)
    res.status(200).json(result)
  },

  update(req, res, next) {
    result = userQueries.updateUser(session, req.query.oldname, req.query.newname)
    res.status(200).json(result)
  },

  destroy(req, res, next) {
    result = userQueries.destroyUser(session, req.query.name)
    res.status(200).json(result)
  },

  createFriendship(req, res, next) {
    result = userQueries.createFriends(session, req.query.user, req.query.friend)
    res.status(200).json(result)
  },

  destroyFriends(req, res, next) {
    result = userQueries.destroyFriends(session, req.query.user, req.query.friend)
    res.status(200).json(result)
  },
}
