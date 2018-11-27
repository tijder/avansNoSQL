const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Content is required.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  votes: [VoteSchema]
});

CommentSchema.virtual('upVotes').get(function () {
  return this.votes.filter(v => v).length;
});

CommentSchema.virtual('downVotes').get(function () {
  return this.votes.filter(v => v == false).length;
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
