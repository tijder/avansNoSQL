const mongoose = require('../mongodb');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  rated: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

//const Vote = mongoose.model('vote', VoteSchema);

module.exports = VoteSchema;
