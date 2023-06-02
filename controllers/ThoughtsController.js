const { Users, Thought } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thoughts found!' });
                }

                res.json(thoughtData);

            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return Users.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thought: _id } },
                    { new: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'User not found!' });
                }

                res.json(thoughtData);

            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thoughts found!' });
                }

                res.json(thoughtData);

            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thoughts found!' });
                }
                return Users.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thought: params.Id } },
                    { new: true }
                )
                
            })

            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thoughts found!' });
                }

                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thoughts found!' });
                }

                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    }

};


module.exports = thoughtController