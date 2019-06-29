const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const {verifyToken, isAdminRole, isSupervisorRole} = require('../controllers/authController');

/* create an user */
router.post('/create', [verifyToken, isSupervisorRole], userController.createUser)
    .get('/all', [verifyToken, ], userController.getAllUsers) /* get all user */
    .get('/:id', [verifyToken, ], userController.getUser) /* get an user */
    .put('/:id', [verifyToken, isSupervisorRole], userController.updateUser) /* update an user */
    .delete('/:id', [verifyToken, isSupervisorRole], userController.deleteUser) /* delete an user */

module.exports = router;