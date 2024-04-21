const express = require('express');
const userController = require('./../controllers/userController.js');
const authenticationController = require('./../controllers/authenticationController.js');

// Routes. Mounting the router
const router = express.Router();

router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);
router.post('/forgotPassword', authenticationController.forgotPassword);
// router.post('/resetPassword', authenticationController.resetPassword);

router.route('/').get(userController.getAllUsers);
//   .post(userController.createUser);
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
