const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // GET single user
        async singleUser(parent, { user = null, params }) {
            return await User.findOne({
                // Logical 'OR' for MongoDB to findONE User based on the user id or username
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
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
        async createUser({ body }, res) {
            const user = await User.create(body);
            if (!user) {
                return res.status(400).json({ message: "Unable to create user" });
            }
            // If user is created, sign token using their info (log them in)
            const token = signToken(user);
            res.json({ token, user });
        },
        // DELETE a book from a user
        async deleteBook({ user, params }, res) {
            // Find the matching user and update their savedBooks
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return res.json(updatedUser);
        },
        // UPDATE savedBooks of a user
        async saveBook({ user, body }, res) {
            try {
                // Append the new book to this user's savedBooks
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                // Return the new user
                return res.json(updatedUser);
            } catch (err) {
                console.log(err);
                return res.status(400).json(err);
            }
        },
    }
}

module.exports = resolvers;