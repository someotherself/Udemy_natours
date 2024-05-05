const express = require('express');
const viewController = require('../controllers/viewsController');
const authenticationController = require('./../controllers/authenticationController');
const router = express.Router();

// Rendering the PUG templates
router.use(authenticationController.isLoggedIn);
router.get('/', viewController.getOverview);
router.get('/login', viewController.getLoginForm);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
