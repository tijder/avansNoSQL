const mongoose = require('mongoose');
const VoteSchema = require('./vote');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  content: {
    type: String,
    required: [true, 'Content is required.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  votes: [VoteSchema],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

ThreadSchema.virtual('upVotes').get(function () {
  return this.votes.filter(v => v).length;
});

ThreadSchema.virtual('downVotes').get(function () {
  return this.votes.filter(v => v == false).length;
});

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;
