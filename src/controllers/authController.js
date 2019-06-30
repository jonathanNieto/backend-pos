const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('../config/config');

module.exports = {

    /* method POST: login */
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: '(Usuario) o contraseña invalidos'
                });
            } else {
                if (! await user.comparePassword(password)) {
                    res.status(400).json({
                        success: false,
                        message: 'Usuario o (contraseña) invalidos'
                    });
                } else {
                    const secretKey = process.env.SECRET_KEY;
                    const token = jwt.sign(
                        { data: user },
                        secretKey,
                        { expiresIn: '1d' }
                    );
                    res.status(200).json({
                        success: true,
                        user,
                        token
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    verifyToken: async (req, res, next) => {
        try {
            const token = req.get('Authorization');
            const decoded = jwt.verify( token, process.env.SECRET_KEY);
            req.user = decoded.data;
            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                error
            });
        }
    },

    isAdminRole: async (req, res, next) => {
        const user = req.user;
        
        if (user.role === 'ADMIN_ROLE') {
            next();
        } else {
            res.status(400).json({
                success: false,
                message: 'No tiene los permisos para realizar esta acción.'
            });
        }
    },

    isSupervisorRole: async (req, res, next) => {
        const user = req.user;
        
        if (user.role === 'ADMIN_ROLE' || user.role === 'SUPERVISOR_ROLE') {
            next();
        } else {
            res.status(400).json({
                success: false,
                message: 'No tiene los permisos para realizar esta acción.'
            });
        }
    },
}