const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,

    maxlength: 280,
  },
  createdAt: {

    type: Date,
    default: Date.now
  },
  username: {
    // (The user that created this thought)
    type: String,
    required: true,
  },
},
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    // Must be between 1 and 280 characters
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    // Set default value to the current timestamp
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    ref: 'Thought'
  },
  reactions: [
    // Array of nested documents created with the `reactionSchema`
    reactionSchema
  ]
},
{
  toJSON: {
    virtuals: true,
    getters: true,
  },
  id: false,
});

// Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thoughts = mongoose.model('Thoughts', thoughtSchema);

module.exports = Thoughts;