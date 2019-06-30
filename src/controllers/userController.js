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

            res.status(201).json({
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
            console.log('req.user', req.user);
            const reqUser = req.user;
            /* Return a copy of the object, filtered to only have values for the whitelisted keys (or array of valid keys) */
            let body = _.pick(req.body, ['name', 'img']);
            if (reqUser.role === 'ADMIN_ROLE') {
                body =_.pick(req.body, ['name', 'role', 'img', 'active']);
            }

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

    /* method PUT: disable an user */
    disable: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({ _id: id, active: true });
            if (user) {
                if (user.role === 'USER_ROLE' || req.user.role === 'ADMIN_ROLE') {
                    user.active = false;
                    await user.save();
                    res.status(200).json({
                        success: true,
                        user
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Solo puede desactivar cuentas de usuario'
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method PUT: enable an user */
    enable: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({ _id: id, active: false });
            if (user) {
                if (user.role === 'USER_ROLE' || req.user.role === 'ADMIN_ROLE') {
                    user.active = true;
                    await user.save();
                    res.status(200).json({
                        success: true,
                        user
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Solo puede activar cuentas de usuario'
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    /* method DELETE: delete an user */
    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({ _id: id });
            if (user) {
                if (user.email === req.user.email) {
                    res.status(400).json({
                        success: false,
                        message: 'No es posible eleminar su propio usuario'
                    });
                } else {
                    
                    await User.deleteOne({_id:id});
                    res.status(200).json({
                        success: true,
                        message: 'Usuario eliminado correctamente'
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
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

// TODO comprobar que se actualicen bien los campos en ambiente de produccion (heroku)
