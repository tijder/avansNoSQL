const mongoose = require('../mongodb');
const VoteSchema = require('./vote');
const Schema = mongoose.Schema;

let schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

const CommentSchema = new Schema({
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
  }],
  username: String
}, schemaOptions);

CommentSchema.virtual('upVotes').get(function () {
  return this.votes.filter(v => v.rated).length;
});

CommentSchema.virtual('downVotes').get(function () {
  return this.votes.filter(v => v.rated === false).length;
});

CommentSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.user;
  return obj;
 }

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
