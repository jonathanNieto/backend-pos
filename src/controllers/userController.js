const User = require('../models/User');
const _ = require('underscore');

module.exports = {

    /* method GET: get all users */
    getAllUsers: async (req, res, next) => {
        try {
            /* users pagination */
            const page = Number(req.query.page) || 0;
            const offset = Number(req.query.offset) || 10;

            const user = await User.find({ active: true }, 'name email')
                .skip(page)
                .limit(offset);
            const count = await User.countDocuments({ active: true });
            res.status(200).json({
                success: true,
                user,
                count
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method GET: get one user */
    getUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method POST: create an user */
    createUser: async (req, res, next) => {
        try {
            const body = req.body;
            const user = new User(body);

            user.password = await user.encryptPassword(body.password);
            await user.save();

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method PUT: update an user */
    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            /* Return a copy of the object, filtered to only have values for the whitelisted keys (or array of valid keys) */
            const body = _.pick(req.body, ['name', 'role', 'img']);

            const user = await User.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method DELETE: this method only sets to false active field */
    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({ _id:id , active:true});
            if (user) {
                user.active = false;
                await user.save();
                res.status(200).json({
                    success: true,
                    user
                });
            } else {
                res.status(404).json({
                    success: true,
                    message: 'Usuario no encontrado'
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    }
}


