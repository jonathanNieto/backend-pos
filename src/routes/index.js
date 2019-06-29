
const express = require('express');

const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');

/* Initializations */
const appRoutes = express();

/* routes */
appRoutes.use('/auth', authRoutes);
appRoutes.use('/user', userRoutes);

module.exports = appRoutes;