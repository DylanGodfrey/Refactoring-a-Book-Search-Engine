const { User } = require('../models');
const { signToken } = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');


const resolvers = {
    Query: {
        // GET single user
        async me(parent, args, context) {
            if (context.user) return User.findOne({_id: context.user._id});
            throw new AuthenticationError("You need to be logged in!")
        },
    },
    Mutation:{
        async login(_, {email, password}) {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('Login information is invalid.');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Login information is invalid.');
            }
            // If user is able to login, sign their token
            const token = signToken(user);
            return {token, user};
        },
        // CREATE new User from body
        async addUser(parent, args) {
            const user = await User.create(args);
            // If user is created, sign token using their info (log them in)
            const token = signToken(user);
            return { token, user };
        },
        // DELETE a book from a user
        async removeBook(_, {bookId}, context) {
            // Find the matching user and update their savedBooks
            if (context.user) {
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                );
            }
            throw new AuthenticationError('You need to be logged in to do this!');
        },
        // UPDATE savedBooks of a user
        async saveBook(_, args, context) {
            if (context.user) {
                // Append the new book to this user's savedBooks
                const user = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: args}},
                    {new: true, runValidators: true}
                );
                // Return the new user
                return user;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    }
}

module.exports = resolvers;