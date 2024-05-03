const express = require('express');
const userController = require('./../controllers/userController');
const authenticationController = require('./../controllers/authenticationController.js');

const router = express.Router();

router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);
router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);

// protect is set as a middleware and applies to all following routes
router.use(authenticationController.protect);

router.patch('/updatePassword', authenticationController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);

// Only allows admins to use the routes after this
router.use(authenticationController.restrict('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(authenticationController.restrict('admin'), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateOne);

// router.delete(
//   '/deleteMe',
//   authenticationController.protect,
//   userController.deleteMe
// );

module.exports = router;
