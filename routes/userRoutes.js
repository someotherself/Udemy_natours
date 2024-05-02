const express = require('express');
const userController = require('./../controllers/userController');
const authenticationController = require('./../controllers/authenticationController.js');

// Routes. Mounting the router
const router = express.Router();

router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);
router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);
router.patch(
  '/updatePassword',
  authenticationController.protect,
  authenticationController.updatePassword
);
router.patch(
  '/updateMe',
  authenticationController.protect,
  userController.updateMe
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    userController.getUser
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    userController.deleteUser
  )
  .patch(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    userController.updateOne
  );

// router.delete(
//   '/deleteMe',
//   authenticationController.protect,
//   userController.deleteMe
// );

module.exports = router;
