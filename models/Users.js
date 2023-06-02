const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Must match a valid email address (look into Mongoose's matching validation)
        match: [/.+\@.+\..+/]
    },
    // Array of `_id` values referencing the `Thought` model
    thought: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    // Array of `_id` values referencing the `User` model (self-reference)
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);
// Create a virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.
usersSchema.virtual('friendsCount').get(function () {
    return this.friends.length;
});


const Users = mongoose.model('Users', usersSchema);

module.exports = Users;