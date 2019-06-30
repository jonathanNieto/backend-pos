const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken, isAdminRole, isSupervisorRole } = require('../controllers/authController');

/* create an user */
router.post('/create', [verifyToken, isSupervisorRole], userController.createUser)
    .get('/all', [verifyToken, isSupervisorRole], userController.getAllUsers) /* get all user */
    .get('/:id', [verifyToken, isSupervisorRole], userController.getUser) /* get an user */
    .put('/update/:id', [verifyToken, isSupervisorRole], userController.updateUser) /* update an user */
    .put('/disable/:id', [verifyToken, isSupervisorRole], userController.disable) /* delete an user */
    .put('/enable/:id', [verifyToken, isSupervisorRole], userController.enable) /* delete an user */
    .delete('/delete/:id', [verifyToken, isAdminRole], userController.deleteUser) /* delete an user */

module.exports = router;